import { NextResponse } from "next/server";

const RESEND_API_URL = "https://api.resend.com/contacts";

type ResendErrorResponse = {
  message?: string;
  name?: string;
};

async function addContactToSegment(apiKey: string, email: string, segmentId: string) {
  const segmentAttachUrl = `${RESEND_API_URL}/${encodeURIComponent(email)}/segments/${segmentId}`;
  const response = await fetch(segmentAttachUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "legis-landing/1.0",
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ResendErrorResponse | null;
    const message = payload?.message ?? "Failed to assign contact to segment.";
    throw new Error(message);
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;

  if (!apiKey || !segmentId) {
    return NextResponse.json({ code: "error" }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ code: "error" }, { status: 400 });
  }

  const resendResponse = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "legis-landing/1.0",
    },
    body: JSON.stringify({
      email,
      segmentIds: [{ id: segmentId }],
      unsubscribed: false,
    }),
  });

  const resendPayload = (await resendResponse.json().catch(() => null)) as ResendErrorResponse | null;
  const resendMessage = resendPayload?.message ?? "";

  // Resend may reject duplicates; keep UX positive for already-subscribed emails.
  if (!resendResponse.ok) {
    if (resendResponse.status === 409 || resendMessage.toLowerCase().includes("already")) {
      try {
        await addContactToSegment(apiKey, email, segmentId);
        return NextResponse.json({ code: "duplicate" });
      } catch {
        return NextResponse.json({ code: "error" }, { status: 502 });
      }
    }

    return NextResponse.json({ code: "error" }, { status: 502 });
  }

  try {
    await addContactToSegment(apiKey, email, segmentId);
  } catch {
    return NextResponse.json({ code: "error" }, { status: 502 });
  }

  return NextResponse.json({ code: "success" });
}
