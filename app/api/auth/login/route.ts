import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password, role } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = await authenticateUser(email, password);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // If a specific role is requested, validate it
  if (role && user.role !== role) {
    return NextResponse.json(
      {
        error: `This login is only for ${
          role === "DOCTOR" ? "doctors" : "super admins"
        }`,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ user });
}
