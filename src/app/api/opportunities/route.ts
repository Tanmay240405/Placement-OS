import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/opportunities
 *
 * Fetches all opportunities for the authenticated user.
 * Supports query params: status, category, search, sort
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const searchParams = request.nextUrl.searchParams;

    const status = searchParams.get("status") || "ALL";
    const category = searchParams.get("category") || "ALL";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "deadline_asc";

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId };

    if (status !== "ALL") {
      where.status = status;
    }

    if (category !== "ALL") {
      if (category === "Other") {
        where.category = {
          notIn: ["Internship", "Full Time"],
        };
      } else {
        where.category = category;
      }
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        {
          roles: {
            some: {
              roleName: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    // Build orderBy
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any;

    switch (sort) {
      case "deadline_asc":
        orderBy = [
          { deadlineDatetime: { sort: "asc", nulls: "last" } },
          { receivedAt: "desc" },
        ];
        break;
      case "received_desc":
        orderBy = { receivedAt: "desc" };
        break;
      case "company_asc":
        orderBy = { companyName: "asc" };
        break;
      default:
        orderBy = { receivedAt: "desc" };
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        roles: true,
      },
      orderBy,
    });

    return NextResponse.json({
      opportunities,
      total: opportunities.length,
    });
  } catch (error) {
    console.error("Failed to fetch opportunities:", error);
    return NextResponse.json(
      { error: "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}
