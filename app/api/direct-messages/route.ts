import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("Conversation ID missing", { status: 400 });
    }

    // Declare a variable to hold messages
    let messages: DirectMessage[] = [];

    if (cursor) {
      // Fetch messages with cursor for pagination
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH, // Fetch the next batch of messages
        cursor: {
          id: cursor, // Use the cursor to paginate from the last message
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true, // Include profile data
            },
          },
        },
        orderBy: {
          createdAt: "desc", // Order by the latest message first
        },
      });
    } else {
      // If no cursor, fetch the first batch of messages
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH, // Limit to the first batch
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true, // Include profile data
            },
          },
        },
        orderBy: {
          createdAt: "desc", // Order by the latest message first
        },
      });
    }

    // Set the next cursor for pagination
    let nextCursor: string | null = null;
    if (messages.length === MESSAGES_BATCH) {
        nextCursor = messages[MESSAGES_BATCH - 1]?.id ?? null; // Set the cursor to the last message's ID
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
