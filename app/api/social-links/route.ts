import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const DEFAULT_LINKS = [
  { platform: 'Telegram', url: 'https://t.me/impactly', display_order: 1, is_active: true },
  { platform: 'X', url: 'https://x.com/impactly', display_order: 2, is_active: true },
  { platform: 'LinkedIn', url: 'https://linkedin.com/company/impactly', display_order: 3, is_active: true }
];

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('social_media_links')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) {
    console.log('Social links table not found, using defaults');
    return NextResponse.json({ links: DEFAULT_LINKS });
  }

  return NextResponse.json({ links: data && data.length > 0 ? data : DEFAULT_LINKS });
}
