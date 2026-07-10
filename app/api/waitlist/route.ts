import { NextResponse } from "next/server";

const RESEND_API_BASE = "https://api.resend.com";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      return NextResponse.json(
        { error: "Waitlist service is not configured." },
        { status: 500 },
      );
    }

    const resendResponse = await fetch(
      `${RESEND_API_BASE}/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "legis-landing/1.0",
        },
        body: JSON.stringify({ email: normalizedEmail }),
        cache: "no-store",
      },
    );

    if (resendResponse.ok) {
      return NextResponse.json({ ok: true });
    }

    // Treat existing contact as successful signup.
    if (resendResponse.status === 409) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const errorText = await resendResponse.text();
    return NextResponse.json(
      { error: "Unable to join waitlist.", details: errorText },
      { status: 502 },
    );
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
