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
            content: `You are an expert research assistant producing neutral, fact-checked, HTML content for a county "intelligence" page aimed at home buyers, sellers, and real estate agents.

Hard requirements:

1. Output valid, self-contained HTML only (no scripts, no external CSS). Use accessible, semantic tags (section, h2, p, ul, li, figure, figcaption, table, thead, tbody, tr, th, td, details, summary).

2. Every numeric claim must include at least one credible citation in square brackets inside the sentence, e.g. … 715,000 residents [U.S. Census — https://…]. Prefer official/primary sources (U.S. Census, BLS, BEA, TN.gov, Metro Nashville, MNPS, NWS, etc.).

3. Add a compact Sources list at the end with human-readable titles and URLs used above.

4. Keep tone professional, concise, and neutral. No hype.

5. Keep sections ≤ ~180 words each. FAQ answers ≤ 3 short paragraphs.

6. No MLS/listing data on this page (only a CTA link to your site's live listings).

7. Do not mention Perplexity or model names. Do not include JSON. Return only HTML.

HTML layout conventions:

- Wrap the whole page in <main id="county-intel">…</main>.
- Use these CSS utility classes in your markup so the app can theme it: container, grid, stat, muted, pill, badge, card, kpi, source-chip, chart, table-compact.
- Stats go in a <section id="stats" class="grid"> as KPI cards (one stat per .kpi).
- Use <details class="faq"> <summary>Q…</summary> <div class="answer">…</div> </details> for FAQs (collapsed by default — good for AEO & UX).
- Put tiny inline "sparklines" as simple SVG placeholders (no external libs) when helpful (e.g., temp range).
- Hero image: Nashville skyline / John Seigenthaler Pedestrian Bridge (captioned), not interior photos.

Citations:

- Inline bracket style in-text is required: [Title — URL]. Titles must match items in the Sources list.
- If numbers vary by source, state a range and cite both.

Guardrails:

- If uncertain, say so briefly and cite the best available source(s).
- No external scripts, tracking pixels, or iframes. No inline base64 images.

Return ONLY the HTML content, no explanations, no markdown code blocks.`
          },
          {
            role: 'user',
            content: `Create an HTML County Intelligence page for Davidson County, Tennessee that is fast, AEO/SEO-friendly, and fully cited.

1) Hero

<section id="hero" class="card">

Heading: "Davidson County, TN: Market Intelligence, Lifestyle & Guides"

One-paragraph synopsis summarizing location, population, economy, and housing with citations.

Hero image: Nashville skyline / John Seigenthaler Pedestrian Bridge. Include a <figure> with <img alt="Nashville skyline over the Cumberland River"> and <figcaption>.

Two buttons:
- "See Live Listings" → /property-search?county=Davidson (just a link, no data embed)
- "Download County PDF" → #download-pdf (anchor; app wires it)

2) Fast Stat Strip (each with citations)

Output as KPI cards inside <section id="stats" class="grid">. Each card:

<article class="kpi">
  <h3>Label</h3>
  <p class="stat">Value</p>
  <p class="muted">method/vintage + inline bracket citation</p>
</article>

Stats to include (latest stable vintages):
- Population (total)
- Median Home Price
- Unemployment Rate
- % Bachelor's+
- Annual Tourists (estimate)

3) Core Sections (10)

Render each as <section class="card"> <h2>…</h2> <p>…</p> </section> with citations and optional tiny SVG charts when helpful.

- Geography & Climate (include a min–max monthly temperature sparkline SVG)
- History
- Demographics & Population
- Education & Schools
- Economy & Employment
- Parks & Recreation
- Culture & Events
- Transportation & Infrastructure
- Government & Local Services
- Real Estate & Housing Market (context only; add CTA link to /property-search?county=Davidson)

4) FAQs (collapsed for AEO)

Top "authority" questions as <details class="faq"> (10 required), each with cited answers:

- What cities are in Davidson County TN?
- What is the population of Davidson County TN?
- What are the main attractions in Davidson County TN?
- How do I contact Davidson County TN government offices?
- What schools are located in Davidson County TN?
- What parks are available in Davidson County TN?
- What is the history of Davidson County TN?
- Are there any annual events in Davidson County TN?
- What counties border Davidson County TN?
- How can I find real estate listings in Davidson County TN? (Answer: link to /property-search?county=Davidson)

Append short "Who/How/Where" FAQs (also <details>; concise, cited):

- How was Davidson County TN named?
- How large is Davidson County TN?
- How safe is Davidson County TN? (crime context)
- How is the weather in Davidson County TN?
- Where can I register to vote in Davidson County TN?
- Who is the mayor of Davidson County (Nashville)?
- Who oversees elections in Davidson County?
- Who governs school districts in Davidson County?

5) Sources

End with <section id="sources" class="card">:

Intro sentence: "Sources used throughout this page."

Unordered list of all sources referenced (title + absolute URL). Titles must match your inline brackets.

Important:
- Do not reference MLS vendors or Realtyna.
- Do not mention Perplexity or model names.
- Return only HTML (no JSON).`
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
      return createErrorResponse('generate-county-html', 'NO_CONTENT', 'No content generated', 500);
    }

    console.log('[generate-county-html] Generated HTML length:', htmlContent.length);

    return createSuccessResponse({
      html: htmlContent
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
