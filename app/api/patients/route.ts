import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ patients });
  } catch (error) {
    console.error("GET /api/patients error", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, age } = body;

    if (!name || !phone || !email || typeof age !== "number") {
      return NextResponse.json(
        { error: "name, phone, email, age are required" },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.create({
      data: { name, phone, email, age },
    });

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    console.error("POST /api/patients error", error);
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}
