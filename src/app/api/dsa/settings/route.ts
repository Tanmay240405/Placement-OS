import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let settings = await prisma.dsaSettings.findUnique({
      where: { userId: session.user.id },
    });

    if (!settings) {
      settings = await prisma.dsaSettings.create({
        data: {
          userId: session.user.id,
          targetProblems: 300,
          totalProblemsSolved: 0,
          codeforcesRating: 0,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[DSA_SETTINGS_GET]", error);
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
    const { leetcodeUsername, totalProblemsSolved, targetProblems, codeforcesRating } = body;

    const settings = await prisma.dsaSettings.upsert({
      where: { userId: session.user.id },
      update: {
        leetcodeUsername,
        totalProblemsSolved: totalProblemsSolved ? parseInt(totalProblemsSolved) : undefined,
        targetProblems: targetProblems ? parseInt(targetProblems) : undefined,
        codeforcesRating: codeforcesRating ? parseInt(codeforcesRating) : undefined,
      },
      create: {
        userId: session.user.id,
        leetcodeUsername,
        totalProblemsSolved: totalProblemsSolved ? parseInt(totalProblemsSolved) : 0,
        targetProblems: targetProblems ? parseInt(targetProblems) : 300,
        codeforcesRating: codeforcesRating ? parseInt(codeforcesRating) : 0,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[DSA_SETTINGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
