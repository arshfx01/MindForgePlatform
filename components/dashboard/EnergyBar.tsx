"use client";

import { useGameStore } from "@/store/gameStore";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export function EnergyBar() {
    const { energy, maxEnergy } = useGameStore();

    return (
        <div className="flex items-center gap-2 bg-background/50 backdrop-blur border border-border px-4 py-2 rounded-full shadow-sm">
            <Zap className={`w-4 h-4 transition-colors ${energy > 0 ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`} />
            <div className="flex gap-1.5 px-1">
                {[...Array(maxEnergy)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={false}
                        animate={{
                            backgroundColor: i < energy ? "hsl(var(--primary))" : "hsl(var(--muted))",
                            opacity: i < energy ? 1 : 0.4,
                            scale: i < energy ? [1, 1.1, 1] : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-3.5 h-1.5 rounded-full"
                    />
                ))}
            </div>
            <span className="font-mono font-bold text-[10px] ml-1 text-muted-foreground uppercase tracking-tighter">{energy}/{maxEnergy}</span>
        </div>
    );
}


