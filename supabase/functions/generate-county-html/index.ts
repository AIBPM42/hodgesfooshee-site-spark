import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders, createSuccessResponse, createErrorResponse } from "../_shared/cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { countySlug } = await req.json();
    
    if (!countySlug || countySlug !== 'davidson-tn') {
      return createErrorResponse('generate-county-html', 'INVALID_SLUG', 'Only davidson-tn is supported in demo', 400);
    }

    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    if (!PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY not configured');
      return createErrorResponse('generate-county-html', 'ENV_MISSING', 'PERPLEXITY_API_KEY is required', 500);
    }

    console.log('[generate-county-html] Calling Perplexity API for Davidson County');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: `You are a real estate data researcher. Return ONLY valid JSON matching this exact schema:

{
  "hero": {
    "synopsis": "3-5 paragraph overview of Davidson County covering location, population, major cities (Nashville), economy, and real estate market. Each fact must have inline citation as [n]."
  },
  "stats": [
    { "label": "Population", "value": "715,884", "caption": "2024 est", "citation": "[1]" },
    ... 9 more stats (Median Home Price, Property Tax Rate, Avg Days on Market, Unemployment %, Top Employer, School Rating, Crime Index, Walkability Score, Median Household Income)
  ],
  "sections": [
    {
      "title": "Geography & Climate",
      "content": "2-4 paragraphs with inline citations [n]. Cover climate, terrain, natural features."
    },
    ... 9 more sections (History & Culture, Demographics, Education & Schools, Economy & Jobs, Cost of Living, Housing Market, Transportation, Parks & Recreation, Healthcare)
  ],
  "faqs": [
    {
      "question": "What is Davidson County known for?",
      "answer": "Detailed answer with citations [n]."
    },
    ... 12-17 more FAQs including all required ones plus 3-7 bonus questions
  ],
  "sources": [
    { "title": "Source Name", "url": "https://..." },
    ... all cited sources with descriptive titles
  ]
}

Requirements:
- Use real 2024-2025 data with accurate citations
- All numeric values as strings with proper formatting
- Every fact needs a citation reference [1], [2], etc.
- Return ONLY the JSON object, no markdown, no explanations`
          },
          {
            role: 'user',
            content: 'Generate comprehensive Davidson County, Tennessee real estate and community data in the specified JSON format.'
          }
        ],
        temperature: 0.2,
        max_tokens: 8000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate-county-html] Perplexity API error:', response.status, errorText);
      return createErrorResponse('generate-county-html', 'PERPLEXITY_ERROR', `API error: ${response.status}`, 500);
    }

    const data = await response.json();
    const jsonContent = data.choices?.[0]?.message?.content || '';

    if (!jsonContent) {
      console.error('[generate-county-html] No content returned from Perplexity');
      return createErrorResponse('generate-county-html', 'NO_CONTENT', 'No content generated', 500);
    }

    console.log('[generate-county-html] Generated content length:', jsonContent.length);

    // Parse the JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(jsonContent);
    } catch (e) {
      console.error('[generate-county-html] Failed to parse JSON:', e);
      return createErrorResponse('generate-county-html', 'PARSE_ERROR', 'Invalid JSON response', 500);
    }

    return createSuccessResponse({
      data: parsedData
    });

  } catch (error) {
    console.error('[generate-county-html] Error:', error);
    return createErrorResponse(
      'generate-county-html',
      'SERVER_ERROR',
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
});
