import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifySession } from "@/lib/auth";
import { getSocialLinks } from "@/lib/content";

const filePath = path.join(process.cwd(), "src/content/social-links.json");

function readLinksFile() {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function writeLinksFile(data: { links: unknown[] }) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = getSocialLinks();
  return NextResponse.json(links);
}

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const link = await request.json();
    const data = readLinksFile();

    link.id = `link-${Date.now()}`;
    data.links.push(link);
    writeLinksFile(data);

    return NextResponse.json(link);
  } catch {
    return NextResponse.json({ error: "שגיאה בהוספת קישור" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updated = await request.json();
    const data = readLinksFile();

    const idx = data.links.findIndex((l: { id: string }) => l.id === updated.id);
    if (idx === -1) {
      return NextResponse.json({ error: "קישור לא נמצא" }, { status: 404 });
    }

    data.links[idx] = { ...data.links[idx], ...updated };
    writeLinksFile(data);

    return NextResponse.json(data.links[idx]);
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון קישור" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    const data = readLinksFile();

    data.links = data.links.filter((l: { id: string }) => l.id !== id);
    writeLinksFile(data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקת קישור" }, { status: 500 });
  }
}
