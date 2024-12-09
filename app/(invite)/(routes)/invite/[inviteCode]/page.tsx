import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  }
  searchParams: Record<string, string | string[] | undefined>;
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  // Await params to resolve the promise
  const resolvedParams = await params;

  // Fetch the current profile
  const profile = await currentProfile();

  // If the user is not signed in, redirect to sign-in page
  if (!profile) {
    return <RedirectToSignIn />;
  }

  // If no invite code is provided, redirect to the homepage
  if (!resolvedParams?.inviteCode) {
    redirect("/");
    return null;
  }

  // Check if the server exists with the invite code and the profile is already a member
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: resolvedParams.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // If the profile is already a member, redirect to the server page
  if (existingServer) {
    redirect(`/servers/${existingServer.id}`);
    return null;
  }

  // Otherwise, add the profile to the server using the invite code
  const server = await db.server.update({
    where: {
      inviteCode: resolvedParams.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  // Redirect to the server page after adding the member
  if (server) {
    redirect(`/servers/${server.id}`);
    return null;
  }

  // Fallback return for edge cases
  return null;
};

export default InviteCodePage;
