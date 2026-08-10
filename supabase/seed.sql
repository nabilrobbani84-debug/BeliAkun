-- Seed file for development

-- Insert Categories
INSERT INTO categories (id, name, slug, description, status, sort_order) VALUES
('11111111-1111-1111-1111-111111111111', 'ChatGPT', 'chatgpt', 'Layanan OpenAI ChatGPT', 'active', 1),
('22222222-2222-2222-2222-222222222222', 'Gemini', 'gemini', 'Layanan Google Gemini', 'active', 2),
('33333333-3333-3333-3333-333333333333', 'Claude', 'claude', 'Layanan Anthropic Claude', 'active', 3),
('44444444-4444-4444-4444-444444444444', 'CapCut', 'capcut', 'Aplikasi edit video CapCut', 'active', 4),
('55555555-5555-5555-5555-555555555555', 'AI Premium', 'ai-premium', 'Aplikasi AI Premium Helper', 'active', 5),
('66666666-6666-6666-6666-666666666666', 'Design dan Edit', 'design-dan-edit', 'Alat Desain dan Editing', 'active', 6),
('77777777-7777-7777-7777-777777777777', 'Entertainment', 'entertainment', 'Layanan Hiburan Streaming', 'active', 7),
('88888888-8888-8888-8888-888888888888', 'VPN dan Security', 'vpn-dan-security', 'VPN dan Keamanan Internet', 'active', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert Products
INSERT INTO products (id, category_id, name, slug, short_description, badge, status, sort_order) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'ChatGPT Plus', 'chatgpt-plus', 'Akses GPT-4 yang lebih cerdas dan cepat.', 'bestseller', 'active', 1),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Gemini Advanced', 'gemini-advanced', 'Model AI Google paling mumpuni.', 'new', 'active', 2),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Claude Pro', 'claude-pro', 'Akses prioritas Claude 3 Opus.', 'none', 'active', 3),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'CapCut Pro', 'capcut-pro', 'Fitur premium CapCut tanpa batas.', 'saving', 'active', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert Product Variants
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, duration_value, duration_unit, package_label, account_type, status, sort_order) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '1 Bulan (Sharing)', 'CGPT-1M-SHR', 49000, 69000, 1, 'month', 'Paling Populer', 'sharing', 'active', 1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '1 Bulan (Private)', 'CGPT-1M-PRV', 299000, 350000, 1, 'month', 'Eksklusif', 'private', 'active', 2),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '1 Bulan (Sharing)', 'GEM-1M-SHR', 45000, 55000, 1, 'month', 'Hemat', 'sharing', 'active', 1),

('cccccccc-cccc-cccc-cccc-cccccccccccc', '1 Bulan (Sharing)', 'CLD-1M-SHR', 59000, 75000, 1, 'month', 'Terbaik', 'sharing', 'active', 1),

('dddddddd-dddd-dddd-dddd-dddddddddddd', '1 Tahun (Sharing)', 'CAP-1Y-SHR', 129000, 150000, 1, 'year', 'Paling Populer', 'sharing', 'active', 1)
ON CONFLICT (sku) DO NOTHING;
