import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function runSQL() {
  console.log('🔧 Running SQL migration directly...\n');

  const sql = await fs.readFile('COPY-THIS-TO-SUPABASE.sql', 'utf-8');

  // Split into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  console.log(`📝 Found ${statements.length} SQL statements\n`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    if (!stmt) continue;

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_string: stmt + ';' });

      if (error) {
        console.error(`❌ Statement ${i + 1} failed:`, error.message);
      } else {
        console.log(`✅ Statement ${i + 1}/${statements.length}`);
      }
    } catch (err: any) {
      console.error(`❌ Statement ${i + 1} error:`, err.message);
    }
  }

  console.log('\n✅ Migration complete!\n');
  console.log('Next: Add PERPLEXITY_API_KEY to .env.local');
  console.log('Then run: bash scripts/setup-counties.sh\n');
}

runSQL();
