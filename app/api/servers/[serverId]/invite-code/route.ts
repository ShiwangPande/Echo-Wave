import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid"
export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const { serverId } = params;
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        // Accessing the body of the request if needed
        const requestBody = await req.json(); // If the body contains JSON
        console.log("Request Body:", requestBody);

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuidv4(),
            },
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
