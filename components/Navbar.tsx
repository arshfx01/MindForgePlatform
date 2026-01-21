"use client";

import Link from "next/link";
import { useGameState } from "@/contexts/GameStateContext";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import Image from "next/image";

const XP_PER_LEVEL = 1000;

export function Navbar() {
  const { gameState } = useGameState();
  const currentLevelXP = gameState.xp % XP_PER_LEVEL;
  const progressToNextLevel = (currentLevelXP / XP_PER_LEVEL) * 100;

  return (
    <nav className="border-b border-border bg-background backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src={"/assets/dark_logo.png"}
              width={40}
              height={40}
              alt="logo"
              className="animate-spin-slow-reverse"
            />
            <span className="text-xl font-bold text-foreground">MindForge</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/leaderboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-medium">Leaderboard</span>
            </Link>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                Level {gameState.level}
              </Badge>
              <div className="w-32">
                <Progress value={progressToNextLevel} className="h-2" />
              </div>
              <span className="text-sm text-muted-foreground">
                {currentLevelXP}/{XP_PER_LEVEL} XP
              </span>
            </div>

            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}
