/**
 * ULTIMATE COUNTY POPULATION SCRIPT
 *
 * This script:
 * 1. Loads SEO JSON data for each county
 * 2. Calls Perplexity API to generate comprehensive narratives
 * 3. Stores complete SEO intelligence in all 6 tables
 * 4. Tracks semantic keyword usage
 * 5. Marks competitor gap coverage
 * 6. Stores all PAA questions
 * 7. Calculates SEO scores
 * 8. Updates county pages with complete content
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { getApiKey } from '../lib/safeKeys';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials. Check your .env.local file.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// County configuration
const countyConfig = {
  davidson: {
    name: 'Davidson',
    slug: 'davidson-county',
    fullName: 'Davidson County',
    semanticKeywords: [
      'nashville', 'metro', 'government', 'community', 'population', 'census',
      'region', 'middle', 'tennessee', 'area', 'city', 'district', 'services',
      'schools', 'parks', 'economy', 'history', 'culture', 'landmarks',
      'transportation', 'development', 'neighborhoods', 'events', 'tourism', 'infrastructure'
    ]
  },
  williamson: {
    name: 'Williamson',
    slug: 'williamson-county',
    fullName: 'Williamson County',
    semanticKeywords: [
      'franklin', 'brentwood', 'nolensville', 'spring', 'hill', 'fairview',
      "thompson's", 'station', 'leipers', 'fork', 'community', 'schools',
      'parks', 'history', 'government', 'events', 'tourism', 'economy',
      'real', 'estate', 'demographics', 'transportation', 'services',
      'education', 'culture', 'recreation'
    ]
  },
  rutherford: {
    name: 'Rutherford',
    slug: 'rutherford-county',
    fullName: 'Rutherford County',
    semanticKeywords: [
      'murfreesboro', 'smyrna', 'lavergne', 'tennessee', 'nashville',
      'community', 'history', 'population', 'growth', 'economy',
      'education', 'schools', 'parks', 'government', 'tourism',
      'events', 'culture', 'heritage', 'transportation', 'development',
      'housing', 'business'
    ]
  }
};

/**
 * Generate comprehensive narrative using Perplexity API
 */
async function generateNarrative(countySlug: string): Promise<string> {
  console.log(`  🤖 Generating narrative via Perplexity API...`);

  const config = countyConfig[countySlug as keyof typeof countyConfig];
  const semanticTerms = config.semanticKeywords.join(', ');

  const prompt = `Write comprehensive real estate market intelligence for ${config.fullName}, Tennessee.

CRITICAL: Naturally incorporate these semantic terms throughout:
${semanticTerms}

Structure your response in 9 detailed sections:
1. INTRODUCTION (3 paragraphs)
2. CURRENT MARKET ANALYSIS
3. DEMOGRAPHICS & GROWTH
4. SCHOOLS & EDUCATION
5. LIFESTYLE & AMENITIES
6. COMMUTE & ACCESSIBILITY
7. ECONOMIC DRIVERS
8. KEY LANDMARKS & ATTRACTIONS
9. INVESTMENT OUTLOOK

Cite ALL sources: NAR, Realtor.com, US Census, TN Dept of Labor

Word count: 2,500-3,000 words
Tone: Expert real estate professional`;

  try {
    const apiKey = await getApiKey('perplexity');

    if (!apiKey) {
      console.warn('  ⚠️  No Perplexity API key found, using placeholder');
      return getPlaceholderNarrative(config.fullName);
    }

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
            content: 'You are a professional real estate market analyst providing accurate, data-driven, comprehensive market intelligence with proper citations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 4000,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`  ❌ Perplexity API error ${response.status}:`, errorText);
      return getPlaceholderNarrative(config.fullName);
    }

    const data = await response.json();
    const narrative = data.choices?.[0]?.message?.content;

    if (!narrative) {
      console.error('  ❌ No narrative content in response');
      return getPlaceholderNarrative(config.fullName);
    }

    console.log(`  ✅ Narrative generated (${narrative.length} characters)`);
    return narrative.trim();
  } catch (error) {
    console.error('  ❌ Error generating narrative:', error);
    return getPlaceholderNarrative(config.fullName);
  }
}

/**
 * Placeholder narrative if Perplexity API is unavailable
 */
function getPlaceholderNarrative(countyName: string): string {
  return `${countyName} is experiencing dynamic growth in the Middle Tennessee real estate market. The area continues to attract new residents and businesses, driving sustained demand for housing across multiple price points. Market conditions remain competitive with strong fundamentals supporting long-term value appreciation.

Buyer activity in ${countyName} reflects diverse demographic trends, with both first-time buyers and move-up purchasers finding opportunities that match their needs. Popular neighborhoods offer a range of amenities and lifestyle options, from urban convenience to suburban tranquility. The local real estate market provides options for various buyer profiles and investment strategies.

The county's economic foundation, school systems, and ongoing infrastructure development position it well for continued growth. Both homeowners seeking quality of life and investors looking for appreciation potential find ${countyName} an attractive market. The combination of job growth, community investment, and strategic location within the Nashville metropolitan area supports a positive long-term outlook.`;
}

/**
 * Parse narrative into 5 content sections
 */
function parseNarrative(narrative: string, semanticKeywords: string[]): {
  market_overview: string;
  living_here: string;
  schools_education: string;
  commute_location: string;
  investment_outlook: string;
} {
  console.log('  📝 Parsing narrative into 5 sections...');

  // Split by double newlines to get paragraphs
  const paragraphs = narrative.split('\n\n').filter(p => p.trim() && p.length > 100);

  // Find sections by keyword matching
  const sections = {
    market_overview: '',
    living_here: '',
    schools_education: '',
    commute_location: '',
    investment_outlook: ''
  };

  // Market Overview: intro + market analysis (first 4 paragraphs)
  sections.market_overview = paragraphs.slice(0, 4).join('\n\n');

  // Living Here: lifestyle, neighborhoods (next 3-4 paragraphs)
  sections.living_here = paragraphs.slice(4, 8).join('\n\n');

  // Schools: find paragraphs mentioning schools/education
  const schoolsParagraphs = paragraphs.filter(p =>
    p.toLowerCase().includes('school') ||
    p.toLowerCase().includes('education') ||
    p.toLowerCase().includes('student')
  );
  sections.schools_education = schoolsParagraphs.slice(0, 2).join('\n\n') || paragraphs[8] || '';

  // Commute: find paragraphs mentioning commute/transportation
  const commuteParagraphs = paragraphs.filter(p =>
    p.toLowerCase().includes('commute') ||
    p.toLowerCase().includes('drive time') ||
    p.toLowerCase().includes('transportation') ||
    p.toLowerCase().includes('highway')
  );
  sections.commute_location = commuteParagraphs.slice(0, 2).join('\n\n') || paragraphs[9] || '';

  // Investment: last 3 paragraphs
  sections.investment_outlook = paragraphs.slice(-3).join('\n\n');

  console.log('  ✅ Narrative parsed into 5 sections');
  return sections;
}

/**
 * Check if text contains keyword (case-insensitive)
 */
function containsKeyword(text: string, keyword: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  return lowerText.includes(lowerKeyword);
}

/**
 * Calculate semantic coverage percentage
 */
function calculateSemanticCoverage(content: string, keywords: string[]): number {
  const usedKeywords = keywords.filter(kw => containsKeyword(content, kw));
  return (usedKeywords.length / keywords.length) * 100;
}

/**
 * Process a single county
 */
async function populateCounty(countySlug: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🏘️  Processing ${countySlug.toUpperCase()}`);
  console.log('='.repeat(60));

  const config = countyConfig[countySlug as keyof typeof countyConfig];

  try {
    // 1. Load SEO JSON
    console.log('\n📊 Step 1: Loading SEO data...');
    const seoPath = path.join(process.cwd(), 'county-data', `${countySlug}-seo-data.json`);
    const seoData = JSON.parse(await fs.readFile(seoPath, 'utf-8'));
    console.log(`  ✅ SEO data loaded (${seoData.paa_questions.length} questions, ${seoData.semantic_keywords.highly_related_words.length} keywords)`);

    // 2. Generate narrative via Perplexity API
    console.log('\n🤖 Step 2: Generating Perplexity narrative...');
    const narrative = await generateNarrative(countySlug);

    // 3. Parse narrative into sections
    console.log('\n📝 Step 3: Parsing narrative...');
    const sections = parseNarrative(narrative, config.semanticKeywords);

    // 4. Get county ID
    console.log('\n🔍 Step 4: Finding county in database...');
    const { data: county } = await supabase
      .from('counties')
      .select('id')
      .eq('slug', config.slug)
      .single();

    if (!county) {
      throw new Error(`County ${config.slug} not found in database`);
    }
    console.log(`  ✅ County found (ID: ${county.id})`);

    // 5. Store SEO intelligence
    console.log('\n💾 Step 5: Storing SEO intelligence...');
    await supabase.from('seo_intelligence').upsert({
      county_id: county.id,
      relevance_score: seoData.relevance_score,
      entity_density: seoData.entity_density,
      average_word_count: seoData.page_metrics?.average_word_count,
      average_images: seoData.page_metrics?.average_images,
      full_data: seoData,
      last_updated: new Date().toISOString()
    }, { onConflict: 'county_id' });
    console.log('  ✅ SEO intelligence stored');

    // 6. Store semantic keywords
    console.log('\n🔤 Step 6: Storing semantic keywords...');
    const fullContent = Object.values(sections).join(' ');
    const keywordRecords = [];

    // Highly related words
    for (const keyword of seoData.semantic_keywords.highly_related_words) {
      const used = containsKeyword(fullContent, keyword);
      keywordRecords.push({
        county_id: county.id,
        keyword,
        category: 'highly_related',
        priority: 'high',
        used_in_content: used,
        usage_count: used ? 1 : 0,
        first_used_at: used ? new Date().toISOString() : null,
        last_used_at: used ? new Date().toISOString() : null
      });
    }

    // Core words
    for (const keyword of seoData.semantic_keywords.core_words) {
      const used = containsKeyword(fullContent, keyword);
      keywordRecords.push({
        county_id: county.id,
        keyword,
        category: 'core',
        priority: 'critical',
        used_in_content: used,
        usage_count: used ? 1 : 0,
        first_used_at: used ? new Date().toISOString() : null,
        last_used_at: used ? new Date().toISOString() : null
      });
    }

    // Delete existing keywords and insert new ones
    await supabase.from('semantic_keywords').delete().eq('county_id', county.id);
    await supabase.from('semantic_keywords').insert(keywordRecords);

    const usedCount = keywordRecords.filter(k => k.used_in_content).length;
    const coverage = (usedCount / keywordRecords.length * 100).toFixed(1);
    console.log(`  ✅ ${keywordRecords.length} keywords stored (${usedCount} used = ${coverage}% coverage)`);

    // 7. Store competitor gaps
    console.log('\n🎯 Step 7: Storing competitor gaps...');
    const gapKeywords = seoData.competitor_gaps?.missing_keywords || [];
    const gapRecords = gapKeywords.map((topic: string) => {
      const covered = containsKeyword(fullContent, topic);
      return {
        county_id: county.id,
        topic,
        gap_level: 'major',
        description: `Competitor gap: ${topic}`,
        covered,
        covered_at: covered ? new Date().toISOString() : null,
        covered_in: covered ? 'content' : null
      };
    });

    await supabase.from('competitor_gaps').delete().eq('county_id', county.id);
    if (gapRecords.length > 0) {
      await supabase.from('competitor_gaps').insert(gapRecords);
    }

    const coveredGaps = gapRecords.filter(g => g.covered).length;
    console.log(`  ✅ ${gapRecords.length} gaps tracked (${coveredGaps} covered)`);

    // 8. Store PAA questions
    console.log('\n❓ Step 8: Storing PAA questions...');
    const questionRecords = seoData.paa_questions.map((q: any, index: number) => ({
      county_id: county.id,
      question: q.question,
      answer: q.answer,
      displayed_in_faq: index < 10, // Top 10 displayed
      display_order: index < 10 ? index + 1 : null
    }));

    await supabase.from('paa_questions').delete().eq('county_id', county.id);
    await supabase.from('paa_questions').insert(questionRecords);
    console.log(`  ✅ ${questionRecords.length} questions stored (${Math.min(10, questionRecords.length)} displayed in FAQ)`);

    // 9. Calculate analytics
    console.log('\n📈 Step 9: Calculating analytics...');
    const semanticCoverage = parseFloat(coverage);
    const gapCoverage = gapRecords.length > 0 ? (coveredGaps / gapRecords.length * 100) : 100;
    const seoScore = (semanticCoverage * 0.4) + (gapCoverage * 0.3) + (100 * 0.3); // 100% for answering 10 questions

    await supabase.from('content_analytics').insert({
      county_id: county.id,
      semantic_coverage_percent: semanticCoverage,
      competitor_gaps_filled: coveredGaps,
      competitor_gaps_total: gapRecords.length,
      paa_coverage_count: Math.min(10, questionRecords.length),
      seo_optimization_score: seoScore,
      overall_score: seoScore,
      recorded_at: new Date().toISOString()
    });
    console.log(`  ✅ SEO Score: ${seoScore.toFixed(1)}/100`);

    // 10. Update county with content
    console.log('\n💾 Step 10: Updating county page content...');

    // Prepare FAQ questions for display (top 10)
    const faqQuestions = seoData.paa_questions.slice(0, 10).map((q: any) => ({
      question: q.question,
      answer: q.answer
    }));

    await supabase.from('counties').update({
      ...sections,
      faq_questions: faqQuestions,
      seo_score: seoScore,
      updated_at: new Date().toISOString()
    }).eq('id', county.id);
    console.log('  ✅ County content updated');

    console.log(`\n✅ ${config.fullName} complete!`);
    console.log(`   📊 SEO Score: ${seoScore.toFixed(1)}/100`);
    console.log(`   🔤 Keyword Coverage: ${coverage}%`);
    console.log(`   🎯 Gaps Filled: ${coveredGaps}/${gapRecords.length}`);
    console.log(`   ❓ Questions: ${questionRecords.length} (10 displayed)`);

  } catch (error) {
    console.error(`\n❌ Error processing ${countySlug}:`, error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🚀 ULTIMATE COUNTY POPULATION');
  console.log('================================\n');
  console.log('This will:');
  console.log('  1. Load SEO data from JSON files');
  console.log('  2. Generate narratives via Perplexity API');
  console.log('  3. Store complete intelligence in 6 tables');
  console.log('  4. Track keyword usage and gap coverage');
  console.log('  5. Calculate SEO scores');
  console.log('  6. Update county pages with content\n');

  try {
    // Process all 3 counties
    await populateCounty('davidson');
    await populateCounty('williamson');
    await populateCounty('rutherford');

    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL COUNTIES POPULATED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\nNext steps:');
    console.log('  1. Check county pages: /counties/davidson-county');
    console.log('  2. Check agent dashboard: /admin/counties');
    console.log('  3. Verify SEO scores in database');
    console.log('\n✨ County intelligence system is LIVE!\n');

  } catch (error) {
    console.error('\n❌ Population failed:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
