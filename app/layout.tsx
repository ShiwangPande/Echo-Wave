import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider"
import ModalProvider from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Analytics } from '@vercel/analytics/next';

const font = Open_Sans({
  subsets: ['latin']
});


export const metadata: Metadata = {
  title: "Echo Wave App",
  description: "Echo Wave: A next-gen communication platform built for seamless collaboration, vibrant communities, and dynamic conversations. Experience communication redefined!",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
     >
      <html lang="en" suppressHydrationWarning>
        <head>
        <link
            rel="icon"
            href="/favicon.ico" 
            type="image/x-icon"
          />
        </head>
        <body
          className={cn(font.className, "bg-white dark:bg-[#313338]")}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="discord-theme"
          >
            <SocketProvider>
            <ModalProvider />
            <QueryProvider>
            {children}
            <Analytics />
            </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
