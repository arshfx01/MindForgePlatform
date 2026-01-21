import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { GameStateProvider } from "@/contexts/GameStateContext";
import { Navbar } from "@/components/Navbar";

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
    <html lang="en">
      <body className={spaceGrotesk.className}>
        <GameStateProvider>
          <Navbar />
          {children}
        </GameStateProvider>
      </body>
    </html>
  );
}
