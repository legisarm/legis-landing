import { NextResponse } from "next/server";

const RESEND_API_BASE = "https://api.resend.com";
const CONTACT_SALES_SEGMENT_ID = "0b63cef5-c7ca-4863-96bd-75b0e5c9a901";

interface ContactSalesPayload {
  fullName?: string;
  email?: string;
  companyName?: string;
  companySize?: string;
  message?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const clean = fullName.trim().replace(/\s+/g, " ");
  const [firstName, ...rest] = clean.split(" ");
  return {
    firstName,
    lastName: rest.join(" "),
  };
}

async function resendRequest(
  path: string,
  options: RequestInit,
  apiKey: string,
): Promise<Response> {
  return fetch(`${RESEND_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "dolegal-landing/1.0",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as ContactSalesPayload;
    const fullName = payload.fullName?.trim() || "";
    const normalizedEmail = payload.email?.trim().toLowerCase() || "";
    const companyName = payload.companyName?.trim() || "";
    const companySize = payload.companySize?.trim() || "";
    const message = payload.message?.trim() || "";

    if (!fullName || !normalizedEmail || !companyName || !companySize || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Contact sales service is not configured." },
        { status: 500 },
      );
    }

    const { firstName, lastName } = splitFullName(fullName);
    const contactBody = {
      email: normalizedEmail,
      first_name: firstName,
      last_name: lastName || undefined,
      properties: {
        company_name: companyName,
        company_size: companySize,
        message,
      },
      segments: [{ id: CONTACT_SALES_SEGMENT_ID }],
    };

    const createContactResponse = await resendRequest(
      "/contacts",
      {
        method: "POST",
        body: JSON.stringify(contactBody),
      },
      apiKey,
    );

    if (!createContactResponse.ok && createContactResponse.status !== 409) {
      const details = await createContactResponse.text();
      return NextResponse.json(
        { error: "Unable to submit contact sales request.", details },
        { status: 502 },
      );
    }

    if (createContactResponse.status === 409) {
      const updateContactResponse = await resendRequest(
        `/contacts/${encodeURIComponent(normalizedEmail)}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName || undefined,
            properties: {
              company_name: companyName,
              company_size: companySize,
              message,
            },
          }),
        },
        apiKey,
      );

      if (!updateContactResponse.ok) {
        const details = await updateContactResponse.text();
        return NextResponse.json(
          { error: "Unable to update existing contact.", details },
          { status: 502 },
        );
      }

      const addToSegmentResponse = await resendRequest(
        `/contacts/${encodeURIComponent(normalizedEmail)}/segments/${CONTACT_SALES_SEGMENT_ID}`,
        {
          method: "POST",
        },
        apiKey,
      );

      if (!addToSegmentResponse.ok && addToSegmentResponse.status !== 409) {
        const details = await addToSegmentResponse.text();
        return NextResponse.json(
          { error: "Unable to add contact to sales segment.", details },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
