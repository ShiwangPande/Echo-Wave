import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import ServerSidebar from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
    children,
    params: initialParams,
}: {
    children: React.ReactNode;
    params: { serverId: string }
}) => {
    // Await params to ensure they're fully resolved
    const { serverId } = await initialParams;

    const profile = await currentProfile();

    if (!profile) {
        return <RedirectToSignIn />;
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (!server) {
        return redirect("/");
    }

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 ">
                <ServerSidebar serverId={serverId} />
            </div>
            <main className="h-full md:pl-60">{children}</main>
        </div>
    );
};

export default ServerIdLayout;
