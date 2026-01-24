"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { SkillRadar } from "@/components/dashboard/SkillRadar";
import { SagaMap } from "@/components/dashboard/SagaMap";
import { useGameStore } from "@/store/gameStore";
import { Flame, Star, Trophy, Loader2 } from "lucide-react";
import { EnergyBar } from "@/components/dashboard/EnergyBar";
import { Button } from "@/components/ui/button";


export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const {
    xp,
    level,
    streak,
    onboardingCompleted,
    fetchProfile,
    setUserId,
    initializeGame,
    initialized
  } = useGameStore();

  useEffect(() => {
    if (user) {
      initializeGame(user.id);
    }
  }, [user, initializeGame]);

  useEffect(() => {
    // Only redirect if the profile has been fully fetched (initialized: true)
    if (initialized && onboardingCompleted === false) {
      router.push("/onboarding");
    }
  }, [initialized, onboardingCompleted, router]);

  if (!user || !initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName || "Analyst"}.
          </h1>
          <p className="text-muted-foreground">
            Your logic engine is primed. Accessing Level {level} protocols.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/levels" className="flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-full shadow-sm hover:border-primary/30 transition-all">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-bold text-xs tracking-tight">{xp} XP</span>
          </Link>
          <Link href="/dashboard/levels" className="flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-full shadow-sm hover:border-primary/30 transition-all">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="font-bold text-xs tracking-tight">Lvl {level}</span>
          </Link>
          <Link href="/dashboard/streak" className="flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-full shadow-sm hover:border-orange-500/30 transition-all">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-bold text-xs tracking-tight">{streak} Day Streak</span>
          </Link>
          <Link href="/dashboard/energy" className="hover:opacity-80 transition-opacity">
            <EnergyBar />
          </Link>
        </div>


      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Progression */}
        <div className="md:col-span-2 space-y-6">
          <SagaMap />
        </div>

        {/* Right Col: Stats */}
        <div className="space-y-6">
          <SkillRadar />

          {/* Daily Dilemma Teaser */}
          <div className="bg-primary/[0.03] border border-primary/10 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group">
            <h3 className="font-bold text-primary mb-3 flex items-center gap-2 uppercase text-[10px] tracking-[0.2em]">
              <Star className="w-3.5 h-3.5 fill-primary" /> Daily Dilemma
            </h3>
            <p className="text-base text-foreground font-semibold mb-6 leading-relaxed">
              &quot;Is it ethical to tax autonomous agents that generate economic value?&quot;
            </p>
            <Link href="/arena" className="block w-full">
              <Button className="w-full font-bold shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all font-sans" size="lg">
                Enter Arena (+2x XP)
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
