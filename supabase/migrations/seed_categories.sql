-- Seed Data: Kategori Produk BeliAkun
-- Jalankan di Supabase SQL Editor setelah Migration 0001 berhasil dijalankan

INSERT INTO public.categories (name, slug, description, status, icon_key, sort_order)
VALUES
  ('AI Premium',        'ai-premium',       'ChatGPT Plus, Gemini Advanced, Claude Pro & AI Generatif',        'active', 'Bot',         1),
  ('Design dan Edit',   'design-dan-edit',  'Canva Pro, CapCut Pro, Adobe & Midjourney',                       'active', 'Palette',     2),
  ('Entertainment',     'entertainment',    'Netflix, Spotify, YouTube Premium & Disney+',                     'active', 'Film',        3),
  ('VPN dan Security',  'vpn-dan-security', 'ExpressVPN, NordVPN, Surfshark & 1Password',                      'active', 'ShieldCheck', 4),
  ('Produktivitas',     'produktivitas',    'Microsoft 365, Notion, Zoom Pro & Google One',                    'active', 'Briefcase',   5),
  ('Edukasi',           'edukasi',          'Duolingo Super, Grammarly, Coursera & Skillshare',                 'active', 'GraduationCap', 6),
  ('Media Sosial',      'media-sosial',     'X Premium (Twitter), Telegram Premium, Discord Nitro',            'active', 'Share2',      7)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_key    = EXCLUDED.icon_key,
  sort_order  = EXCLUDED.sort_order,
  status      = EXCLUDED.status,
  updated_at  = NOW();
