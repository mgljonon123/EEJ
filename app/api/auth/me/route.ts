import { NextResponse } from "next/server";
import { getCurrentUserFromToken, logoutUser } from "@/lib/auth";

export async function GET() {
  const user = getCurrentUserFromToken();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({ user });
}

export async function POST() {
  // simple logout endpoint
  logoutUser();
  return NextResponse.json({ success: true });
}


