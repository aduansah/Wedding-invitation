import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/rsvpAdmin";
import { clearRsvpSubmissions } from "@/lib/rsvpStore";

export async function POST() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await clearRsvpSubmissions();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to clear RSVP submissions:", error);
    return NextResponse.json(
      { error: "Unable to clear RSVP data right now." },
      { status: 500 },
    );
  }
}
