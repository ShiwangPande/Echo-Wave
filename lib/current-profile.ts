import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const currentProfile = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const profile = await db.profile.findUnique({
      where: {
        userId,
      },
    });

    return profile || null; 
  } catch (error) {
    console.error("Error in currentProfile:", error);
    return null; 
  }
};
