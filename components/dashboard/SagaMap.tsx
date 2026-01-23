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
        <div className="w-full p-6 bg-card rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-6">The Path</h3>
            <div className="relative flex flex-col gap-8 ml-4 border-l-2 border-muted pl-8 pb-4">
                {LEVELS.map((level, index) => {
                    const isUnlocked = currentLevel >= level.minLevel;
                    const isCompleted = currentLevel > level.minLevel + 5; // Placeholder logic

                    return (
                        <div key={level.id} className="relative group">
                            {/* Node Dot */}
                            <div
                                className={cn(
                                    "absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 transition-all duration-300",
                                    isUnlocked
                                        ? "bg-background border-primary shadow-[0_0_10px_var(--primary)]"
                                        : "bg-muted border-muted-foreground"
                                )}
                            />

                            {/* Content Card */}
                            <Link
                                href={isUnlocked ? `/arena?level=${level.id}` : "#"}
                                className={cn(
                                    "block p-4 rounded-lg border transition-all duration-200",
                                    isUnlocked
                                        ? "bg-secondary/50 border-primary/20 hover:border-primary hover:bg-secondary cursor-pointer"
                                        : "bg-muted/10 border-transparent opacity-60 cursor-not-allowed"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-foreground">{level.title}</h4>
                                        <p className="text-sm text-muted-foreground">Level {level.minLevel}+ • {level.type}</p>
                                    </div>
                                    <div className="text-primary">
                                        {isCompleted ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : isUnlocked ? (
                                            <Unlock className="w-5 h-5" />
                                        ) : (
                                            <Lock className="w-5 h-5 text-muted-foreground" />
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
