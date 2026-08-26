import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const patterns = await prisma.patternProgress.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json(patterns);
  } catch (error) {
    console.error("[DSA_PATTERNS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { patternId, status, optionalProgress } = body;

    if (!patternId || !status) {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    const patternProgress = await prisma.patternProgress.upsert({
      where: {
        userId_patternId: {
          userId: session.user.id,
          patternId,
        },
      },
      update: {
        status,
        optionalProgress: optionalProgress ? parseInt(optionalProgress) : null,
      },
      create: {
        userId: session.user.id,
        patternId,
        status,
        optionalProgress: optionalProgress ? parseInt(optionalProgress) : null,
      },
    });

    return NextResponse.json(patternProgress);
  } catch (error) {
    console.error("[DSA_PATTERNS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
