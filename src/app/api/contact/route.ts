import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { brandName, contactName, email, type, message } = body;

    // Basic validation
    if (!brandName || !contactName || !email || !type || !message) {
      return NextResponse.json(
        { error: "כל השדות המסומנים הם חובה" },
        { status: 400 }
      );
    }

    // For now, just log the submission
    // In production, integrate with an email service like Resend
    console.log("New contact form submission:", {
      brandName,
      contactName,
      email,
      phone: body.phone,
      type,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "שגיאה בשליחת הטופס" },
      { status: 500 }
    );
  }
}
