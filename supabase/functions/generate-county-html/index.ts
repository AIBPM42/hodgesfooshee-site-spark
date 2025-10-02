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
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a real estate research expert. Generate semantic HTML for county pages.
Rules:
- Use ONLY semantic HTML: <section>, <h1-3>, <p>, <ul>, <li>, <a>
- Every fact MUST include citation link <a href="source_url" target="_blank" rel="noopener noreferrer">[n]</a>
- No <script>, <style>, or inline CSS
- Include class attributes for styling hooks
- Output valid, well-formed HTML
- Be factual and cite recent 2024-2025 sources`
          },
          {
            role: 'user',
            content: `Generate HTML for Davidson County, Tennessee page with:

1. HERO SECTION (class="hero-synopsis"):
   - 3-5 paragraph overview covering: location, population, major cities (Nashville), economy, real estate market snapshot
   - Include inline citations [1], [2], etc.

2. STATS STRIP (10 cards, class="stat-card"):
   Each card: <div class="stat-card"><h3>Label</h3><p class="value">Number</p><p class="caption">Context</p></div>
   Stats: Population, Median Home Price, Property Tax Rate, Avg Days on Market, Unemployment %, Top Employer, School Rating, Crime Index, Walkability Score, Median Household Income

3. TEN CONTENT SECTIONS (class="content-section"):
   Each: <section class="content-section"><h2>Title</h2><p>2-4 paragraphs with inline citations</p></section>
   Topics: Geography & Climate, History & Culture, Demographics, Education & Schools, Economy & Jobs, Cost of Living, Housing Market, Transportation, Parks & Recreation, Healthcare

4. FAQs (class="faq-item"):
   10 required questions + 3-5 bonus questions
   Required: What is Davidson County known for?, How much do homes cost?, Best neighborhoods for families?, Property taxes?, Job market?, School quality?, Commute times?, Things to do?, Moving tips?, Real estate trends?
   Format: <div class="faq-item"><h3 class="faq-q">Question?</h3><p class="faq-a">Answer with citations.</p></div>

5. SOURCES (class="sources-list"):
   <ul class="sources-list"><li><a href="url" target="_blank" rel="noopener noreferrer">Source Title</a></li>...</ul>
   Include all cited URLs with descriptive titles

Use recent 2024-2025 data. Make content authoritative and helpful.

Return ONLY valid HTML with no markdown code blocks. Start directly with the hero section HTML.`
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
    const htmlContent = data.choices?.[0]?.message?.content || '';

    if (!htmlContent) {
      console.error('[generate-county-html] No content returned from Perplexity');
      return createErrorResponse('generate-county-html', 'NO_CONTENT', 'No HTML generated', 500);
    }

    console.log('[generate-county-html] Generated HTML length:', htmlContent.length);

    // Parse the HTML into sections
    const heroMatch = htmlContent.match(/<div class="hero-synopsis">([\s\S]*?)<\/div>/);
    const statsMatch = htmlContent.match(/<div class="stat-card">[\s\S]*?<\/div>/g);
    const sectionsMatch = htmlContent.match(/<section class="content-section">[\s\S]*?<\/section>/g);
    const faqsMatch = htmlContent.match(/<div class="faq-item">[\s\S]*?<\/div>/g);
    const sourcesMatch = htmlContent.match(/<ul class="sources-list">[\s\S]*?<\/ul>/);

    return createSuccessResponse({
      html: {
        hero: heroMatch ? heroMatch[0] : '<div class="hero-synopsis"><p>Davidson County is home to Nashville, Tennessee.</p></div>',
        stats: statsMatch ? statsMatch.join('') : '',
        sections: sectionsMatch || [],
        faqs: faqsMatch || [],
        sources: sourcesMatch ? sourcesMatch[0] : '<ul class="sources-list"></ul>'
      }
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
