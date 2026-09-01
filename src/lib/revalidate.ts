import { revalidatePath } from "next/cache";

// Public pages are cached for a day now, so an admin edit has to push the fresh
// copy out itself instead of waiting for the window to lapse.
export const PAGE_PATHS: Record<string, string> = {
  home: "/",
  products: "/products",
  blog: "/blog",
  academy: "/academy",
  links: "/links",
  contact: "/contact",
};

/**
 * Drops the cache for every public page. Admin edits are rare and the tables
 * feed several pages each, so clearing all of them beats maintaining a map of
 * which table shows up where.
 */
export function revalidateSite() {
  revalidatePath("/", "layout");
}
