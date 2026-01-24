"use client";

import { useGameStore } from "@/store/gameStore";
import { Flame, Calendar, Trophy, Zap, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getWeeklyActivity } from "@/app/actions/game";

export function StreakCalendar() {
    const { streak } = useGameStore();
    const [weeklyActivity, setWeeklyActivity] = useState<any[]>([]);

    useEffect(() => {
        async function fetchActivity() {
            const data = await getWeeklyActivity();
            setWeeklyActivity(data);
        }
        fetchActivity();
    }, []);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date().getDay();

    // Check if user had activity on a specific day of the current week
    const hasActivityOnDay = (dayIndex: number) => {
        const d = new Date();
        const diff = d.getDay() - dayIndex;
        const targetDate = new Date(d);
        targetDate.setDate(d.getDate() - diff);
        const targetDateStr = targetDate.toDateString();

        return weeklyActivity.some(activity => {
            const activityDate = new Date(activity.createdAt).toDateString();
            return activityDate === targetDateStr;
        });
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto py-8 px-4">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/5 border border-orange-500/20 rounded-full text-orange-600 font-bold text-xs uppercase tracking-widest">
                    <Flame className="w-4 h-4 fill-orange-500" /> Cognitive Momentum
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-foreground">Consistency Protocol</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">Critical thinking is a muscle. Daily engagement ensures peak cognitive performance and neuroplasticity.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Streak Stats */}
                <Card className="md:col-span-1 rounded-[2.5rem] border-border/40 shadow-xl bg-white flex flex-col items-center justify-center p-12 text-center space-y-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-orange-500/[0.02] pointer-events-none group-hover:bg-orange-500/[0.04] transition-colors" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <Flame className="w-24 h-24 text-orange-500 fill-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-orange-500 rounded-full blur-2xl"
                        />
                    </motion.div>

                    <div className="relative z-10">
                        <span className="text-7xl font-black tracking-tighter text-foreground leading-none">{streak}</span>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.3em] mt-2">Day Streak</p>
                    </div>

                    <p className="text-xs text-muted-foreground/60 font-medium leading-relaxed mt-4">You are in the top 15% of consistent thinkers this week.</p>
                </Card>

                {/* Weekly Calendar View */}
                <Card className="md:col-span-2 rounded-[2.5rem] border-border/40 shadow-xl bg-white overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold">This Week</CardTitle>
                                <CardDescription>Your activity fingerprint</CardDescription>
                            </div>
                            <Calendar className="w-6 h-6 text-muted-foreground opacity-30" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-10">
                        <div className="grid grid-cols-7 gap-4">
                            {days.map((day, i) => {
                                const active = hasActivityOnDay(i);
                                const isToday = i === today;

                                return (
                                    <div key={day} className="flex flex-col items-center gap-4">
                                        <div className={cn(
                                            "w-full aspect-[4/5] rounded-[1.5rem] border flex flex-col items-center justify-center gap-2 transition-all duration-500",
                                            active ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20" :
                                                isToday ? "bg-white border-primary/40 text-primary border-dashed" :
                                                    "bg-muted/30 border-border/40 text-muted-foreground/30"
                                        )}>
                                            {active ? (
                                                <CheckCircle2 className="w-6 h-6" />
                                            ) : (
                                                <Circle className="w-6 h-6 opacity-20" />
                                            )}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            isToday ? "text-primary" : active ? "text-orange-600" : "text-muted-foreground/40"
                                        )}>{day}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-12 p-6 bg-muted/20 rounded-[2rem] border border-border/40 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm">
                                    <Trophy className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground">Next Milestone: 7 Days</p>
                                    <p className="text-[10px] font-medium text-muted-foreground">Unlock the "Clockwork" Badge</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-black text-foreground">{Math.min(100, (streak / 7) * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
