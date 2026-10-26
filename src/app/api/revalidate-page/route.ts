import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { PAGE_PATHS } from "@/lib/revalidate";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Revalidate-Secret",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// Refresh one page from outside the app. Admin edits inside the app go through
// revalidateSite() directly; this is for anything else that changes content.
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (secret && req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "forbidden" }, { status: 403, headers: CORS_HEADERS });
  }

  let pageKey: string | undefined;
  try {
    const body = (await req.json()) as { pageKey?: string };
    pageKey = body.pageKey;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400, headers: CORS_HEADERS });
  }

  if (!pageKey || !PAGE_PATHS[pageKey]) {
    return NextResponse.json({ error: "unknown page" }, { status: 400, headers: CORS_HEADERS });
  }

  revalidatePath(PAGE_PATHS[pageKey]);
  return NextResponse.json(
    { revalidated: true, path: PAGE_PATHS[pageKey] },
    { headers: CORS_HEADERS }
  );
}
