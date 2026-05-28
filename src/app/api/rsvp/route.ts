import { NextResponse } from "next/server";
import { addRsvpSubmission } from "@/lib/rsvpStore";

function sanitizeName(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, 80);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: unknown;
      lastName?: unknown;
    };

    const firstName = sanitizeName(body.firstName);
    const lastName = sanitizeName(body.lastName);

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required." },
        { status: 400 },
      );
    }

    const submission = await addRsvpSubmission(firstName, lastName);

    return NextResponse.json({ ok: true, submission });
  } catch {
    return NextResponse.json(
      { error: "Unable to save RSVP right now. Please try again." },
      { status: 500 },
    );
  }
}
