/**
 * Populate real chart metrics using Perplexity AI
 * Gets actual market data for: Inventory vs Demand, Days on Market, List-to-Sale Ratio
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { getApiKey } from '../lib/safeKeys';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getChartMetrics(countyName: string) {
  console.log(`\n📊 Fetching real market metrics for ${countyName}...`);

  const apiKey = await getApiKey('perplexity');
  if (!apiKey) {
    console.error('❌ No Perplexity API key found');
    return null;
  }

  const prompt = `Provide REAL, current market data for ${countyName}, Tennessee real estate market (last 12 months, monthly data points). I need JSON format with these exact metrics:

1. **inventoryVsDemand** (12 months): Active listings count and Pending sales count for each month (Jan-Dec 2024)
2. **daysOnMarket** (12 months): Median days on market for each month (Jan-Dec 2024)
3. **listToSale** (12 months): List-to-sale price ratio as percentage (e.g., 98.5 means homes sold for 98.5% of list price)

Return ONLY valid JSON in this format:
{
  "inventoryVsDemand": [
    {"month": "Jan", "active": 4200, "pending": 2856},
    {"month": "Feb", "active": 4100, "pending": 2800},
    ...
  ],
  "daysOnMarket": [
    {"month": "Jan", "dom": 25},
    {"month": "Feb", "dom": 23},
    ...
  ],
  "listToSale": [
    {"month": "Jan", "ratio": 98.5},
    {"month": "Feb", "ratio": 98.7},
    ...
  ]
}

Use real data from NAR, Realtor.com, or local MLS sources. Be precise with actual numbers.`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a real estate data analyst. Return ONLY valid JSON with no markdown formatting, no code blocks, no explanation. Just the raw JSON object.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Perplexity API error ${response.status}:`, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('❌ No content in response');
      return null;
    }

    // Clean the response - remove markdown code blocks if present
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```\n?/g, '');
    }

    const metrics = JSON.parse(jsonContent);
    console.log(`✅ Got metrics for ${countyName}`);
    console.log(`   - Inventory data points: ${metrics.inventoryVsDemand?.length || 0}`);
    console.log(`   - DOM data points: ${metrics.daysOnMarket?.length || 0}`);
    console.log(`   - List-to-Sale data points: ${metrics.listToSale?.length || 0}`);

    return metrics;

  } catch (error) {
    console.error(`❌ Error fetching metrics for ${countyName}:`, error);
    return null;
  }
}

async function updateCountyMetrics(slug: string, metrics: any) {
  console.log(`\n💾 Updating ${slug} with chart metrics...`);

  const { error } = await supabase
    .from('counties')
    .update({
      chart_metrics: metrics,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug);

  if (error) {
    console.error('❌ Error updating county:', error);
    return false;
  }

  console.log(`✅ ${slug} updated successfully`);
  return true;
}

async function main() {
  console.log('\n🚀 CHART METRICS POPULATION');
  console.log('================================\n');

  const counties = [
    { name: 'Davidson County', slug: 'davidson-county' },
    { name: 'Williamson County', slug: 'williamson-county' },
    { name: 'Rutherford County', slug: 'rutherford-county' },
  ];

  for (const county of counties) {
    const metrics = await getChartMetrics(county.name);

    if (metrics) {
      await updateCountyMetrics(county.slug, metrics);
    }

    // Rate limit: wait 5 seconds between requests
    if (counties.indexOf(county) < counties.length - 1) {
      console.log('\n⏱️  Waiting 5 seconds (rate limit)...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 CHART METRICS POPULATED!');
  console.log('='.repeat(60));
  console.log('\nNext: Update county mapper to use real chart_metrics from database\n');
}

main().catch(console.error);
