import { supabase } from "./supabase";
import { getSiteConfig } from "./content";

// site_settings key holding the AliExpress affiliate URL that /go and /s load
// in a hidden iframe to paint the affiliate cookie before redirecting.
// Editable from admin/short-links; falls back to site-config.json when unset.
export const AFFILIATE_COOKIE_URL_KEY = "affiliate_cookie_url";

export async function getAffiliateCookieUrl(): Promise<string> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", AFFILIATE_COOKIE_URL_KEY)
    .single();

  const fromDb = data?.value?.trim();
  if (fromDb) return fromDb;

  try {
    return getSiteConfig().affiliateCookieUrl?.trim() || "";
  } catch {
    return "";
  }
}
