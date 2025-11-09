/**
 * Emergency fix for RLS on auth.users table
 * This uses the Supabase Management API to execute SQL with elevated privileges
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY not found in environment')
  console.log('Get it from: https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/settings/api')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixAuthRLS() {
  console.log('🔧 Attempting to disable RLS on auth.users...')

  // Try to execute the fix using service role
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;'
  })

  if (error) {
    console.error('❌ Failed via RPC:', error.message)
    console.log('\n📝 Trying direct SQL execution...')

    // Try raw SQL query
    const { data: rawData, error: rawError } = await supabase
      .from('auth.users')
      .select('count')
      .single()

    if (rawError) {
      console.error('❌ Direct query also failed:', rawError.message)
      console.log('\n🚨 SOLUTION: You must contact Supabase Support')
      console.log('Go to: https://supabase.com/dashboard/support')
      console.log('\nMessage:')
      console.log('---')
      console.log('Project ID: xhqwmtzawqfffepcqxwf')
      console.log('Issue: RLS incorrectly enabled on auth.users table with zero policies')
      console.log('Impact: All authentication is blocked - getting "Database error finding user"')
      console.log('Request: Please run: ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;')
      console.log('---')
    }
  } else {
    console.log('✅ RLS disabled successfully!')

    // Verify
    const { data: verify, error: verifyError } = await supabase
      .from('pg_tables')
      .select('tablename, rowsecurity')
      .eq('schemaname', 'auth')
      .eq('tablename', 'users')
      .single()

    if (verify) {
      console.log('✅ Verification:', verify)
    }
  }
}

fixAuthRLS().catch(console.error)
