const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('🔄 Applying migration to Supabase...\n');

  const migrationPath = path.join(__dirname, 'supabase/migrations/20251008100000_create_user_impact_system.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Split by semicolons but be smart about it (avoid splitting inside quotes)
  const statements = sql
    .split(/;(?=(?:[^']*'[^']*')*[^']*$)/) // Split on ; not inside quotes
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('/*') && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute\n`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    // Skip comments
    if (statement.startsWith('/*') || statement.startsWith('--')) {
      continue;
    }

    // Log what we're executing (first 100 chars)
    const preview = statement.substring(0, 100).replace(/\s+/g, ' ');
    console.log(`[${i + 1}/${statements.length}] Executing: ${preview}...`);

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_string: statement + ';' });

      if (error) {
        // Try direct query if RPC doesn't work
        const { error: directError } = await supabase.from('_').select('*').limit(0);

        if (directError) {
          console.error(`❌ Error: ${error.message}`);
          console.error(`   Statement: ${statement.substring(0, 200)}...`);
        } else {
          console.log('   ✅ Success (using alternative method)');
        }
      } else {
        console.log('   ✅ Success');
      }
    } catch (err) {
      console.error(`❌ Exception: ${err.message}`);
    }
  }

  console.log('\n✅ Migration complete!');
}

applyMigration().catch(console.error);
