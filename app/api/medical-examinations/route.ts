import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const examFields = [
  "surname",
  "gender",
  "chiefComplaint",
  "vod",
  "vos",
  "odSph",
  "odCyl",
  "odAxis",
  "osSph",
  "osCyl",
  "osAxis",
  "nearVisionOD",
  "nearVisionOS",
  "iop",
  "eyeMovement",
  "eyeMovementDirection",
  "eyeMovementRestricted",
  "conjunctivaOD",
  "conjunctivaOS",
  "corneaOD",
  "corneaOS",
  "anteriorChamberOD",
  "anteriorChamberOS",
  "pupilOD",
  "pupilOS",
  "irisOD",
  "irisOS",
  "lensOD",
  "lensOS",
  "retinaOD",
  "retinaOS",
  "vitreousOD",
  "vitreousOS",
  "maculaOD",
  "maculaOS",
  "bloodVesselsOD",
  "bloodVesselsOS",
  "diagnosis",
  "recommendations",
  "followUp",
] as const;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");

  try {
    if (!patientId) {
      const exams = await prisma.medicalExamination.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ exams });
    }

    const exam = await prisma.medicalExamination.findFirst({
      where: { patientId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ exam });
  } catch (error) {
    console.error("GET /api/medical-examinations error", error);
    return NextResponse.json(
      { error: "Failed to fetch examinations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { patientId, exam } = await req.json();

    if (!patientId || typeof patientId !== "string") {
      return NextResponse.json(
        { error: "patientId is required" },
        { status: 400 }
      );
    }

    const payload: Record<string, string | null | undefined> = {};
    for (const key of examFields) {
      if (exam && key in exam) {
        payload[key] = exam[key];
      }
    }

    const created = await prisma.medicalExamination.create({
      data: {
        patientId,
        ...payload,
      },
    });

    return NextResponse.json({ exam: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/medical-examinations error", error);
    return NextResponse.json(
      { error: "Failed to save examination" },
      { status: 500 }
    );
  }
}
