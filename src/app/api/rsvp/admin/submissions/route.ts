import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/rsvpAdmin";
import { listRsvpSubmissions } from "@/lib/rsvpStore";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const submissions = await listRsvpSubmissions();
  return NextResponse.json({ submissions });
}
