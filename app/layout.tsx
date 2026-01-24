import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { GameOverlay } from "@/components/overlays/GameOverlay";

// Loading Inter for all weights needed for gamification
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "MindForge - Gamified AI Platform for Critical Thinking",
  description: "Level up your critical thinking skills through gamified scenarios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="light">
        {/* We apply the font-sans class globally here */}
        <body
          className={`${inter.variable} font-sans bg-background text-foreground antialiased`}
        >
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <GameOverlay />
        </body>
      </html>
    </ClerkProvider>
  );
}