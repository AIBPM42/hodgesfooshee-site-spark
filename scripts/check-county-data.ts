import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkData() {
  const { data, error } = await supabase
    .from('counties')
    .select('id, name, slug, market_overview, living_here, schools_education, commute_location, investment_outlook, faq_questions, seo_score')
    .eq('slug', 'davidson-county')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Davidson County Data:');
  console.log('- Name:', data.name);
  console.log('- Slug:', data.slug);
  console.log('- SEO Score:', data.seo_score);
  console.log('- Market Overview:', data.market_overview ? `${data.market_overview.substring(0, 100)}...` : 'NULL');
  console.log('- Living Here:', data.living_here ? `${data.living_here.substring(0, 100)}...` : 'NULL');
  console.log('- Schools:', data.schools_education ? `${data.schools_education.substring(0, 100)}...` : 'NULL');
  console.log('- Commute:', data.commute_location ? `${data.commute_location.substring(0, 100)}...` : 'NULL');
  console.log('- Investment:', data.investment_outlook ? `${data.investment_outlook.substring(0, 100)}...` : 'NULL');
  console.log('- FAQ Questions:', data.faq_questions ? JSON.stringify(data.faq_questions).substring(0, 100) + '...' : 'NULL');
}

checkData();
