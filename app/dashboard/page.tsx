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
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border shadow-sm">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-mono font-bold">{xp} XP</span>
          </div>
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border shadow-sm">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="font-mono font-bold">Lvl {level}</span>
          </div>
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border shadow-sm">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span className="font-mono font-bold">{streak} Day Streak</span>
          </div>
          <EnergyBar />
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
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <Star className="w-4 h-4" /> Daily Dilemma
            </h3>
            <p className="text-sm text-foreground/80 mb-4 font-medium italic">
              &quot;Is it ethical to tax autonomous agents that generate economic value?&quot;
            </p>
            <Link href="/arena">
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:brightness-110 transition-all active:scale-[0.98] shadow-lg">
                Enter Arena (+2x XP)
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
