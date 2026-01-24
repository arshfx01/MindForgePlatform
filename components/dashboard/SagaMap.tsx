"use client";

import { Lock, Unlock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/gameStore";
import Link from "next/link";

const LEVELS = [
    { id: 1, title: "The Apprentice", minLevel: 1, type: "Logic" },
    { id: 2, title: "The Analyst", minLevel: 5, type: "Business" },
    { id: 3, title: "The Strategist", minLevel: 15, type: "Geopolitics" },
    { id: 4, title: "The Sage", minLevel: 30, type: "Philosophy" },
];

export function SagaMap() {
    const currentLevel = useGameStore((state) => state.level);

    return (
        <div className="w-full p-6 md:p-8 bg-card rounded-2xl border border-border/60 shadow-sm">
            <h3 className="text-xl font-bold mb-8 tracking-tight">The Path</h3>
            <div className="relative flex flex-col gap-10 ml-4 border-l-[1.5px] border-border/50 pl-10 pb-4">
                {LEVELS.map((level, index) => {
                    const isUnlocked = currentLevel >= level.minLevel;
                    const isCompleted = currentLevel > level.minLevel + 5;

                    return (
                        <div key={level.id} className="relative group">
                            {/* Node Dot */}
                            <div
                                className={cn(
                                    "absolute -left-[49px] top-1.5 h-4 w-4 rounded-full border-[3px] transition-all duration-500",
                                    isUnlocked
                                        ? "bg-primary border-primary ring-4 ring-primary/10"
                                        : "bg-background border-muted-foreground/30"
                                )}
                            />

                            {/* Content Card */}
                            <Link
                                href={isUnlocked ? `/arena?level=${level.id}` : "#"}
                                className={cn(
                                    "block p-5 rounded-2xl border transition-all duration-300",
                                    isUnlocked
                                        ? "bg-background border-border hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
                                        : "bg-muted/5 border-transparent opacity-50 cursor-not-allowed"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h4 className={cn(
                                            "font-bold transition-colors",
                                            isUnlocked ? "text-foreground" : "text-muted-foreground"
                                        )}>{level.title}</h4>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                                            Lvl {level.minLevel}+ • {level.type}
                                        </p>
                                    </div>
                                    <div className={cn(
                                        "p-2 rounded-full transition-colors",
                                        isUnlocked ? "bg-primary/5 text-primary" : "text-muted-foreground/30"
                                    )}>
                                        {isCompleted ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        ) : isUnlocked ? (
                                            <Unlock className="w-5 h-5" />
                                        ) : (
                                            <Lock className="w-5 h-5" />
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

