#!/usr/bin/env node
/**
 * Skill: Check Authentication Status
 * Validates that Supabase auth is properly configured
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function checkAuth() {
  console.log('🔍 Checking Authentication Configuration...\n');

  // Check for .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    process.exit(1);
  }

  // Load environment variables
  require('dotenv').config({ path: envPath });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  console.log('✅ Environment variables loaded');
  console.log(`   URL: ${supabaseUrl}`);

  // Test Supabase connection
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      process.exit(1);
    }

    console.log('✅ Supabase connection successful');

    // Check if profiles table exists
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (profileError) {
      console.error('❌ Profiles table error:', profileError.message);
    } else {
      console.log('✅ Profiles table accessible');
    }

    // Check middleware exists
    const middlewarePath = path.join(process.cwd(), 'middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      console.log('✅ middleware.ts exists (route protection enabled)');
    } else {
      console.log('⚠️  middleware.ts missing (no route protection)');
    }

    console.log('\n✨ Authentication check complete!');
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

checkAuth();
