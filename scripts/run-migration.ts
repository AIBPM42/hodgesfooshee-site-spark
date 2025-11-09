/**
 * Run the database migration directly
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🔧 Running database migration...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20251020_add_ultimate_intelligence_tables.sql');
    const sql = await fs.readFile(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded');
    console.log(`   Size: ${(sql.length / 1024).toFixed(1)} KB`);
    console.log('   Executing SQL...\n');

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });

    if (error) {
      // If exec_sql doesn't exist, we need to run it differently
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        console.log('⚠️  exec_sql function not available');
        console.log('\n📋 Please run the migration manually:');
        console.log('   1. Go to your Supabase dashboard');
        console.log('   2. Click "SQL Editor"');
        console.log('   3. Copy and paste the contents of:');
        console.log('      supabase/migrations/20251020_add_ultimate_intelligence_tables.sql');
        console.log('   4. Click "Run"');
        console.log('\n   Then run: npx tsx scripts/populate-counties-ultimate.ts\n');
        return;
      }
      throw error;
    }

    console.log('✅ Migration executed successfully!\n');
    console.log('Next step: Run population script');
    console.log('   npx tsx scripts/populate-counties-ultimate.ts\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n📋 Please run the migration manually:');
    console.log('   1. Go to your Supabase dashboard');
    console.log('   2. Click "SQL Editor"');
    console.log('   3. Copy and paste the contents of:');
    console.log('      supabase/migrations/20251020_add_ultimate_intelligence_tables.sql');
    console.log('   4. Click "Run"');
    console.log('\n   Then run: npx tsx scripts/populate-counties-ultimate.ts\n');
  }
}

runMigration();
