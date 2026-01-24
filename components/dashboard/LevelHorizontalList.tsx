"use client";

import { useGameStore } from "@/store/gameStore";
import { Award, Shield, Sword, Crown, Lock, ChevronRight, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const LEVEL_DATA = [
    { title: "Initiate", level: 1, icon: Star, color: "text-slate-400", bg: "bg-slate-50", desc: "First steps into the Forge. Understanding basic logic principles." },
    { title: "Apprentice", level: 5, icon: Award, color: "text-blue-500", bg: "bg-blue-50", desc: "Developing patterns for business and social scenarios." },
    { title: "Analyst", level: 15, icon: Shield, color: "text-purple-500", bg: "bg-purple-50", desc: "Advanced synthesis of geopolitics and systemic thinking." },
    { title: "Strategist", level: 30, icon: Sword, color: "text-orange-500", bg: "bg-orange-50", desc: "Mastering complex crises and long-term consequences." },
    { title: "Grandmaster", level: 50, icon: Crown, color: "text-amber-500", bg: "bg-amber-50", desc: "Refining philosophical foundations of consciousness." },
];

export function LevelHorizontalList() {
    const { level, xp } = useGameStore();

    return (
        <div className="space-y-12 max-w-6xl mx-auto py-12 px-4 overflow-hidden">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-full text-primary font-bold text-xs uppercase tracking-widest">
                    <Crown className="w-4 h-4 fill-primary" /> Authority Ranking
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-foreground">Hierarchy of Thought</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">Your influence in the MindForge ecosystem grows with every trial resolved. Ascend through the ranks of critical analysis.</p>
            </header>

            {/* Current Status Board */}
            <div className="bg-white border border-border/60 rounded-[3rem] p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.02] rounded-full blur-[100px] -mr-32 -mt-32" />

                <div className="relative z-10 w-40 h-40 shrink-0 flex items-center justify-center bg-primary rounded-[2.5rem] shadow-2xl shadow-primary/20">
                    <span className="text-6xl font-black text-white tracking-tighter">{level}</span>
                    <span className="absolute -bottom-3 bg-foreground text-background text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter border-4 border-white shadow-sm">Rank</span>
                </div>

                <div className="flex-1 space-y-6 relative z-10 w-full">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-foreground tracking-tight uppercase italic">{LEVEL_DATA.find(l => level >= l.level && (!LEVEL_DATA[LEVEL_DATA.indexOf(l) + 1] || level < LEVEL_DATA[LEVEL_DATA.indexOf(l) + 1].level))?.title || "Initiate"}</h2>
                            <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Current Authority Tier</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">{xp} Total XP</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                            <span>Next Tier Progress</span>
                            <span>{xp % 1000} / 1000 XP</span>
                        </div>
                        <Progress value={(xp % 1000) / 10} className="h-2 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Horizontal Scroll Area */}
            <div className="relative pt-8 pb-12">
                <div className="flex gap-10 overflow-x-auto pb-12 pt-4 px-4 no-scrollbar scroll-smooth">
                    {LEVEL_DATA.map((data, i) => {
                        const isUnlocked = level >= data.level;
                        const isCurrent = level >= data.level && (!LEVEL_DATA[i + 1] || level < LEVEL_DATA[i + 1].level);
                        const Icon = data.icon;

                        return (
                            <motion.div
                                key={data.title}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                    "min-w-[320px] p-8 rounded-[2.5rem] border transition-all duration-500 relative flex flex-col group",
                                    isUnlocked ? "bg-white border-border/40 shadow-sm" : "bg-muted/10 border-dashed border-border/60 grayscale opacity-40"
                                )}
                            >
                                {isCurrent && (
                                    <div className="absolute -top-4 -right-4 bg-primary text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg z-20 border-4 border-background uppercase tracking-tighter animate-pulse">
                                        Current
                                    </div>
                                )}

                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-110 duration-500",
                                    data.bg, data.color
                                )}>
                                    {isUnlocked ? <Icon className="w-8 h-8" /> : <Lock className="w-6 h-6 opacity-40 text-muted-foreground" />}
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div>
                                        <h3 className="text-2xl font-black text-foreground tracking-tight uppercase italic">{data.title}</h3>
                                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Level {data.level}+</span>
                                    </div>
                                    <p className="text-sm text-foreground/50 leading-relaxed font-medium">{data.desc}</p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-3 h-3 text-primary fill-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Mastery Required</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-20" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
