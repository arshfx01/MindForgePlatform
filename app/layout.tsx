import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { GameOverlay } from "@/components/overlays/GameOverlay";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "MindForge - Gamified AI Platform for Critical Thinking",
  description:
    "Level up your critical thinking skills through gamified scenarios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${spaceGrotesk.className} bg-background text-foreground antialiased`}>
          <Navbar />
          {children}
          <GameOverlay />
        </body>
      </html>
    </ClerkProvider>
  );
}
