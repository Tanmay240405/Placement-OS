import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchLeetCodeStats } from "@/services/leetcode/leetcodeService";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return new NextResponse("Username is required", { status: 400 });
    }

    const stats = await fetchLeetCodeStats(username);

    if (!stats) {
      return new NextResponse("Failed to fetch LeetCode data", { status: 500 });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[DSA_LEETCODE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
