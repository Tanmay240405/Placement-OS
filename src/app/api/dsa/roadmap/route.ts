import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const progress = await prisma.roadmapProgress.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[DSA_ROADMAP_GET]", error);
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
    const { topicId, subtopicId, isCompleted } = body;

    if (!topicId || !subtopicId || typeof isCompleted !== 'boolean') {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    const progress = await prisma.roadmapProgress.upsert({
      where: {
        userId_topicId_subtopicId: {
          userId: session.user.id,
          topicId,
          subtopicId,
        },
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        topicId,
        subtopicId,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[DSA_ROADMAP_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
