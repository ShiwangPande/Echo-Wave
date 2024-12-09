"use client";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import { useEffect, useState } from "react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

// Helper function to truncate URL
const truncateUrl = (url: string, length: number = 50) => {
  if (url.length <= length) return url;
  return url.slice(0, length) + "...";
};

const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const [fileType, setFileType] = useState<string>("");

  useEffect(() => {
    // Detect MIME type based on the URL
    const detectFileType = async (url: string) => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        const contentType = response.headers.get("Content-Type");

        if (contentType) {
          // Check if the content type matches an image or pdf
          if (contentType.includes("image")) {
            setFileType("image");
          } else if (contentType.includes("pdf")) {
            setFileType("pdf");
          } else {
            setFileType("unknown");
          }
        }
      } catch (error) {
        console.error("Error detecting file type: ", error);
        setFileType("unknown");
      }
    };

    if (value) {
      detectFileType(value);
    }
  }, [value]);

  // Handle image file (non-pdf)
  if (value && fileType === "image") {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full"
        />
        <button onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm" type="button"
        >
          <X className="h-4 w-4"/>
        </button>
      </div>
    );
  }

  // Handle PDF file
  if (value && fileType === "pdf") {
    const truncatedUrl = truncateUrl(value); // Truncate URL if too long
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
        <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
          {truncatedUrl}
        </a>
        <button onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm" type="button"
        >
          <X className="h-4 w-4"/>
        </button>
      </div>
    );
  }

  // Default state: Uploading a file
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res?.[0]?.url) {
          onChange(res[0].url);
        }
      }}
      onUploadError={(error: Error) => {
        console.log("File upload error: ", error);
      }}
    />
  );
};

export default FileUpload;
