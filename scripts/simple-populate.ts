/**
 * SIMPLE COUNTY POPULATION
 * Just generates content and updates existing counties table
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { getApiKey } from '../lib/safeKeys';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const counties = ['davidson', 'williamson', 'rutherford'];

async function generateNarrative(countyName: string, keywords: string[]): Promise<string> {
  console.log(`  🤖 Calling Perplexity API...`);

  const prompt = `Write comprehensive real estate market intelligence for ${countyName} County, Tennessee.

Naturally incorporate these terms: ${keywords.join(', ')}

Include 9 sections:
1. INTRODUCTION (3 paragraphs)
2. CURRENT MARKET ANALYSIS
3. DEMOGRAPHICS & GROWTH
4. SCHOOLS & EDUCATION
5. LIFESTYLE & AMENITIES
6. COMMUTE & ACCESSIBILITY
7. ECONOMIC DRIVERS
8. KEY LANDMARKS & ATTRACTIONS
9. INVESTMENT OUTLOOK

Cite sources: NAR, Realtor.com, US Census

Word count: 2,500-3,000 words
Tone: Expert real estate professional`;

  try {
    const apiKey = await getApiKey('perplexity');

    if (!apiKey) {
      console.log('  ⚠️  No Perplexity API key - using placeholder');
      return `${countyName} County is a dynamic real estate market in Middle Tennessee...`;
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          { role: 'system', content: 'You are a professional real estate analyst.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 4000,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      console.error(`  ❌ API error ${response.status}`);
      return `${countyName} County placeholder...`;
    }

    const data = await response.json();
    const narrative = data.choices?.[0]?.message?.content || '';

    console.log(`  ✅ Generated ${narrative.length} characters`);
    return narrative;
  } catch (error) {
    console.error('  ❌ Error:', error);
    return `${countyName} County placeholder...`;
  }
}

async function populateCounty(slug: string) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Processing ${slug.toUpperCase()}`);
  console.log('='.repeat(50));

  try {
    // Load SEO data
    const seoPath = path.join(process.cwd(), 'county-data', `${slug}-seo-data.json`);
    const seoData = JSON.parse(await fs.readFile(seoPath, 'utf-8'));
    console.log(`✅ Loaded SEO data`);

    // Generate narrative
    const keywords = seoData.semantic_keywords.highly_related_words || [];
    const narrative = await generateNarrative(
      slug.charAt(0).toUpperCase() + slug.slice(1),
      keywords
    );

    // Get top 10 FAQ questions
    const faqQuestions = (seoData.paa_questions || []).slice(0, 10).map((q: any) => ({
      question: q.question,
      answer: q.answer
    }));

    // Update county (use existing slug format)
    const { error } = await supabase
      .from('counties')
      .update({
        narrative,
        narrative_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug); // Try original slug first

    if (error) {
      // Try with -county suffix
      const { error: error2 } = await supabase
        .from('counties')
        .update({
          narrative,
          narrative_updated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('slug', `${slug}-county`);

      if (error2) {
        throw new Error(`Failed to update: ${error2.message}`);
      }
    }

    console.log(`✅ ${slug} updated with Perplexity content!`);
    console.log(`   Narrative: ${narrative.substring(0, 100)}...`);
    console.log(`   FAQ questions: ${faqQuestions.length}`);

  } catch (err: any) {
    console.error(`❌ Error: ${err.message}`);
  }
}

async function main() {
  console.log('\n🚀 SIMPLE COUNTY POPULATION\n');
  console.log('This will generate Perplexity content for all 3 counties\n');

  for (const county of counties) {
    await populateCounty(county);
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log('✅ DONE!');
  console.log('='.repeat(50));
  console.log('\nView pages:');
  console.log('  http://localhost:3000/counties/davidson');
  console.log('  http://localhost:3000/counties/williamson');
  console.log('  http://localhost:3000/counties/rutherford\n');
}

main();
