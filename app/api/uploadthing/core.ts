import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from '@clerk/nextjs/server';

const f = createUploadthing();

// Authentication middleware
const handleAuth = async () => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId: userId };
};

// FileRouter configuration
export const ourFileRouter = {
  serverImage: f({
    image: {
      maxFileSize: "4MB", // 4MB, in bytes
      maxFileCount: 1,
    },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  
  messageFile: f({
    image: {
      maxFileSize: "4MB", // 4MB limit for images
      maxFileCount: 1,
    },
    pdf: {
      maxFileSize: "16MB", // 10MB limit for PDFs
      maxFileCount: 1,
    },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
