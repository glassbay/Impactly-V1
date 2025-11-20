import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Create social_media_links table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS social_media_links (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          platform text NOT NULL,
          url text NOT NULL,
          display_order integer DEFAULT 0,
          is_active boolean DEFAULT true,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
      `
    });

    if (createError) {
      console.error('Table creation error:', createError);
    }

    // Insert default social links
    const { error: insertError } = await supabase
      .from('social_media_links')
      .upsert([
        { platform: 'Telegram', url: 'https://t.me/impactly', display_order: 1, is_active: true },
        { platform: 'X', url: 'https://x.com/impactly', display_order: 2, is_active: true },
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/impactly', display_order: 3, is_active: true }
      ], { onConflict: 'platform' });

    if (insertError) {
      console.error('Insert error:', insertError);
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error: any) {
    console.error('Database initialization error:', error);
    return NextResponse.json({
      error: 'Failed to initialize database',
      details: error.message
    }, { status: 500 });
  }
}
