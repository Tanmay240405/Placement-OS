import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/opportunities/[id]/status
 *
 * Updates the status of an opportunity.
 * Validates that the opportunity belongs to the authenticated user.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!["NOT_REGISTERED", "REGISTERED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be NOT_REGISTERED or REGISTERED." },
        { status: 400 }
      );
    }

    // Verify ownership
    const opportunity = await prisma.opportunity.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 }
      );
    }

    // Update status
    const updated = await prisma.opportunity.update({
      where: { id },
      data: { status },
      include: { roles: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
