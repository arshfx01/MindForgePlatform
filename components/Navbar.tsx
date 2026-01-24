"use client";

import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Trophy, Menu, X, Coins, LogIn, LayoutDashboard } from "lucide-react"; // Added Icons
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnergyBar } from "@/components/dashboard/EnergyBar";
import { Button } from "@/components/ui/button";

const XP_PER_LEVEL = 1000;

export function Navbar() {
  const { xp, level, userId } = useGameStore();
  const currentLevelXP = xp % XP_PER_LEVEL;
  const progressToNextLevel = (currentLevelXP / XP_PER_LEVEL) * 100;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-[100]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href={userId ? "/dashboard" : "/"} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src={"/assets/dark_logo.png"}
              width={36}
              height={36}
              alt="logo"
              className="animate-spin-slow-reverse"
            />
            <span className="text-xl font-bold text-foreground tracking-tight hidden sm:block">MindForge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <SignedIn>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group mr-2"
              >
                <div className="p-1.5 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <LayoutDashboard className="h-4 w-4 text-primary/60" />
                </div>
                <span className="text-sm font-bold">Dashboard</span>
              </Link>

              <Link href="/dashboard/energy" className="hover:opacity-80 transition-opacity">

                <EnergyBar />
              </Link>

              <div className="h-6 w-[1px] bg-border/50" />

              <Link
                href="/leaderboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Trophy className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Leaderboard</span>
              </Link>

              <Link href="/dashboard/levels" className="flex items-center gap-4 bg-muted/40 p-1 rounded-full border border-border/40 pr-4 hover:border-primary/30 transition-all">
                <Badge variant="secondary" className="text-[10px] bg-background shadow-none border-border/50 px-2 py-0 h-6">
                  Lvl {level}
                </Badge>
                <div className="flex flex-col gap-0.5 w-32">
                  <div className="flex justify-between text-[8px] uppercase font-bold text-muted-foreground tracking-tighter">
                    <span>XP</span>
                    <span>{Math.floor(progressToNextLevel)}%</span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-1" />
                </div>
              </Link>

              <UserButton afterSignOutUrl="/" appearance={{
                elements: {
                  avatarBox: "w-8 h-8 border-2 border-primary/10 hover:border-primary/30 transition-all shadow-sm"
                }
              }} />
            </SignedIn>

            <SignedOut>
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2">
                Ethos
              </Link>
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2">
                Whitepaper
              </Link>
              <div className="h-6 w-[1px] bg-border/50 mx-2" />
              <SignInButton mode="modal">
                <Button variant="ghost" className="font-bold uppercase tracking-widest text-xs gap-2">
                  <LogIn className="w-4 h-4" /> Sign In
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button className="font-black uppercase tracking-widest text-xs px-6 rounded-full shadow-lg shadow-primary/10">
                  Join Forge
                </Button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="h-9 px-4 rounded-full font-bold text-[10px] uppercase tracking-widest">Sign In</Button>
              </SignInButton>
            </SignedOut>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full h-10 w-10"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>


        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-border overflow-hidden bg-background"
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-center scale-110 py-2">
                <EnergyBar />
              </div>

              <div className="space-y-4 bg-muted/30 p-6 rounded-3xl border border-border/40">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Progress</span>
                  <Badge variant="outline" className="text-primary border-primary/20 text-[10px]">Lvl {level}</Badge>
                </div>
                <Progress value={progressToNextLevel} className="h-1.5" />
                <div className="text-right text-[10px] text-muted-foreground font-mono tracking-tighter">
                  {currentLevelXP} / {XP_PER_LEVEL} XP
                </div>
              </div>

              <Link
                href="/leaderboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-5 rounded-[1.5rem] bg-card border border-border/40 hover:border-primary/30 transition-all shadow-sm active:scale-[0.98]"
              >
                <span className="flex items-center gap-3 font-bold text-sm">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Leaderboard
                </span>
                <div className="p-2 rounded-full bg-muted/50">
                  <Coins className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}
