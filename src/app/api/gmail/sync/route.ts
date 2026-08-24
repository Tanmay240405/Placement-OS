import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGmailClient } from "@/lib/gmail/client";
import { fetchSupersetMessageIds, fetchFullMessage } from "@/lib/gmail/fetchMessages";
import { extractMessage } from "@/lib/gmail/extractMessage";
import { parseSupersetJobEmail } from "@/lib/parser/parseSupersetJob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/gmail/sync
 *
 * Syncs Superset emails from the last 30 days.
 * 1. Fetches email IDs from Gmail
 * 2. Skips already-synced messages
 * 3. Parses new job openings
 * 4. Stores in database
 */
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Create Gmail client
    const gmail = await createGmailClient(userId);

    // Fetch message IDs
    const messageIds = await fetchSupersetMessageIds(gmail);

    if (messageIds.length === 0) {
      return NextResponse.json({
        success: true,
        newOpportunities: 0,
        totalEmails: 0,
        message: "No Superset emails found in the last 30 days.",
      });
    }

    // Get existing gmail message IDs for this user to avoid duplicates
    const existingMessages = await prisma.opportunity.findMany({
      where: { userId },
      select: { gmailMessageId: true },
    });
    const existingIds = new Set(existingMessages.map((m) => m.gmailMessageId));

    let newOpportunities = 0;

    // Process each message
    for (const messageId of messageIds) {
      // Skip already synced
      if (existingIds.has(messageId)) {
        continue;
      }

      try {
        // Fetch full message
        const rawMessage = await fetchFullMessage(gmail, messageId);

        // Extract structured data
        const extractedEmail = extractMessage(rawMessage);

        // Parse the email
        const parsed = parseSupersetJobEmail(extractedEmail);

        if (!parsed) {
          continue; // Not a job opening or parse failed
        }

        // Store in database
        await prisma.opportunity.create({
          data: {
            userId,
            gmailMessageId: parsed.gmailMessageId,
            threadId: parsed.threadId,
            companyName: parsed.companyName,
            category: parsed.category,
            deadlineRaw: parsed.deadlineRaw,
            deadlineDatetime: parsed.deadlineDatetime,
            applicationUrl: parsed.applicationUrl,
            emailSubject: parsed.emailSubject,
            senderEmail: parsed.sender,
            receivedAt: parsed.receivedAt,
            status: "NOT_REGISTERED",
            roles: {
              create: parsed.roles.map((roleName) => ({
                roleName,
              })),
            },
          },
        });

        newOpportunities++;
      } catch (error) {
        // Log but don't fail the whole sync
        console.error(`Failed to process message ${messageId}:`, error);
      }
    }

    // Store last sync time in a simple way (using user's updatedAt)
    await prisma.user.update({
      where: { id: userId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      newOpportunities,
      totalEmails: messageIds.length,
      message:
        newOpportunities > 0
          ? `Sync complete! ${newOpportunities} new opportunit${newOpportunities === 1 ? "y" : "ies"} found.`
          : "Sync complete! No new opportunities found.",
    });
  } catch (error) {
    console.error("Sync error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to sync emails.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
