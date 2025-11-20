# Database Migration Instructions

## Overview
The application is now configured to work with default social media links. However, for full functionality (including Impact tracking, charity preferences, and PACT credits), you need to apply the database migration.

## Quick Start (App Works Without Migration)
The app will run perfectly fine without applying the migration. It uses these default social links:
- **Telegram**: https://t.me/impactly
- **X**: https://x.com/impactly
- **LinkedIn**: https://linkedin.com/company/impactly

## To Apply the Full Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `/supabase/migrations/20251008100000_create_user_impact_system.sql`
5. Paste into the SQL Editor
6. Click **Run** to execute

This will create:
- ✅ `social_media_links` table (admin-configurable social icons)
- ✅ `user_charity_preferences` table (user's selected nonprofits)
- ✅ `user_purchases` table (transaction history)
- ✅ `charity_treasury` table (charity contributions tracking)
- ✅ `user_pact_credits` table (Impact Credits wallet)

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

### Option 3: Manual Table Creation

If you only need the social links (not the full Impact system), run this minimal SQL:

```sql
CREATE TABLE IF NOT EXISTS social_media_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_media_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read social links"
  ON social_media_links FOR SELECT
  USING (true);

INSERT INTO social_media_links (platform, url, display_order, is_active)
VALUES
  ('Telegram', 'https://t.me/impactly', 1, true),
  ('X', 'https://x.com/impactly', 2, true),
  ('LinkedIn', 'https://linkedin.com/company/impactly', 3, true);
```

## Managing Social Links

Once the migration is applied, you can manage social media links through the database:

1. Go to Supabase Dashboard → Table Editor
2. Select `social_media_links` table
3. Edit URLs, add/remove platforms, change display order
4. Changes will reflect immediately in the app

## What Works Without Migration

✅ All pages load correctly
✅ Navigation works
✅ Social media icons (using defaults)
✅ Marketplace browsing
✅ Authentication
✅ Contact form

## What Requires Migration

❌ Custom social media links (uses defaults)
❌ Impact dashboard tracking
❌ Charity preferences
❌ PACT credits system
❌ Purchase history

## Support

If you need help with the migration, contact: info@pineapple.world
