-- Seed the 4 homepage links that were previously hardcoded in HeroSection.tsx
-- Uses ON CONFLICT to avoid duplicates if they already exist

INSERT INTO short_links (id, code, target_url, title, published, show_on_homepage, coupon_code, coupon_note, color, clicks)
VALUES
  (gen_random_uuid(), 'shiptanbul', 'https://shiptanbul.com/?ref=barshlomo', 'Shiptanbul', true, true, 'liel15', 'יוון ואנגליה', 'from-warm-300 to-rose-400', 0)
ON CONFLICT (code) DO UPDATE SET
  show_on_homepage = true,
  title = EXCLUDED.title,
  coupon_code = EXCLUDED.coupon_code,
  coupon_note = EXCLUDED.coupon_note,
  color = EXCLUDED.color;

INSERT INTO short_links (id, code, target_url, title, published, show_on_homepage, color, clicks)
VALUES
  (gen_random_uuid(), 'superpharm', 'https://go.scrmgo.com/23LWNBNG/2QZRGT1/?url=https://shop.super-pharm.co.il/baby', 'סופר פארם', true, true, 'from-foreground to-foreground/80', 0)
ON CONFLICT (code) DO UPDATE SET
  show_on_homepage = true,
  title = EXCLUDED.title,
  color = EXCLUDED.color;

INSERT INTO short_links (id, code, target_url, title, published, show_on_homepage, coupon_code, color, clicks)
VALUES
  (gen_random_uuid(), 'terminalx', 'https://s.humanz.ai/terminalbids/741575/192', 'טרמינל X', true, true, '15FS', 'from-rose-400 to-rose-500', 0)
ON CONFLICT (code) DO UPDATE SET
  show_on_homepage = true,
  title = EXCLUDED.title,
  coupon_code = EXCLUDED.coupon_code,
  color = EXCLUDED.color;

INSERT INTO short_links (id, code, target_url, title, published, show_on_homepage, color, clicks)
VALUES
  (gen_random_uuid(), 'aliexpress', 'https://s.click.aliexpress.com/e/_c4lfajWT', 'מבצעים אלי אקספרס', true, true, 'from-warm-200 to-warm-300', 0)
ON CONFLICT (code) DO UPDATE SET
  show_on_homepage = true,
  title = EXCLUDED.title,
  color = EXCLUDED.color;
