"use client";

import { useGameStore } from "@/store/gameStore";
import { Zap, Clock, Info, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export function EnergyDetail() {
    const { energy, maxEnergy, lastEnergyUpdate } = useGameStore();
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        if (energy >= maxEnergy) {
            setTimeLeft("Fully Charged");
            return;
        }

        const updateTimer = () => {
            const lastUpdate = lastEnergyUpdate ? new Date(lastEnergyUpdate) : new Date();
            const nextUnitTime = new Date(lastUpdate.getTime() + 4 * 60 * 60 * 1000);
            const now = new Date();
            const diff = nextUnitTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft("Replenishing...");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        };

        const timer = setInterval(updateTimer, 1000);
        updateTimer();

        return () => clearInterval(timer);
    }, [energy, maxEnergy, lastEnergyUpdate]);

    return (
        <div className="space-y-8 max-w-4xl mx-auto py-8 px-4">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-full text-primary font-bold text-xs uppercase tracking-widest">
                    <Zap className="w-4 h-4 fill-primary" /> Energy Core
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-foreground">Neuro-Buffer Systems</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">Energy is required to enter the Arena. High-intensity cognitive trials temporarily deplete your mental buffer.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Main Energy Card */}
                <Card className="rounded-[2.5rem] border-border/40 shadow-xl overflow-hidden bg-white group">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-2xl font-bold">Current Reserve</CardTitle>
                        <CardDescription>Real-time mental energy status</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-6xl font-black tracking-tighter text-foreground">{energy} / {maxEnergy}</span>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Energy Units Available</p>
                            </div>
                            <div className="relative">
                                <Zap className={cn(
                                    "w-16 h-16 transition-all duration-500",
                                    energy > 0 ? "text-amber-500 fill-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" : "text-muted-foreground opacity-20"
                                )} />
                                {energy < maxEnergy && (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute -inset-2 border-2 border-dashed border-primary/20 rounded-full"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <span>Refill Progress</span>
                                <span>{energy >= maxEnergy ? "100%" : "Recharging"}</span>
                            </div>
                            <Progress value={(energy / maxEnergy) * 100} className="h-4 rounded-full bg-muted/30" />
                        </div>

                        <div className="bg-muted/30 p-6 rounded-3xl flex items-center gap-4 border border-border/40">
                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Next Unit In</p>
                                <p className="text-xl font-black text-foreground tabular-nums tracking-tighter">{timeLeft}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <div className="space-y-6">
                    <Card className="rounded-[2rem] border-border/40 bg-muted/10 shadow-sm border-dashed">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" /> How it Works
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4 text-sm text-muted-foreground leading-relaxed">
                            <p>Entering the **Arena** consumes **1 Energy Unit**. This represents the cognitive load required to process high-stakes scenarios.</p>
                            <p>Energy replenishes automatically at a rate of **1 unit every 4 hours**. This ensures you approach each trial with a fresh perspective.</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-border/40 bg-primary/[0.02] shadow-sm border-primary/10">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                                <ShieldCheck className="w-5 h-5" /> Unlimited Energy?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4 text-sm text-muted-foreground leading-relaxed">
                            <p>Want to train without limits? **Premium MindForge** access provides unlimited energy and exclusive logic trials.</p>
                            <Button className="w-full mt-2 font-bold uppercase tracking-widest" variant="outline">Learn More</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
