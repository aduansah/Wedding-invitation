import { NextResponse } from "next/server";
import { addRsvpSubmission } from "@/lib/rsvpStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
  } catch (error) {
    console.error("RSVP save failed:", error);

    const message =
      error instanceof Error && error.message.includes("not configured")
        ? "RSVP storage is not configured yet. Please try again shortly."
        : "Unable to save RSVP right now. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
