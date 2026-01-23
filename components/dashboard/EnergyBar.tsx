"use client";

import { useGameStore } from "@/store/gameStore";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export function EnergyBar() {
    const { energy, maxEnergy } = useGameStore();

    return (
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border shadow-sm">
            <Zap className={`w-5 h-5 ${energy > 0 ? "text-blue-500 fill-blue-500" : "text-muted-foreground"}`} />
            <div className="flex gap-1">
                {[...Array(maxEnergy)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={false}
                        animate={{
                            backgroundColor: i < energy ? "rgb(59, 130, 246)" : "rgb(229, 231, 235)",
                            scale: i < energy ? 1 : 0.9,
                        }}
                        className="w-4 h-2 rounded-full"
                    />
                ))}
            </div>
            <span className="font-mono font-bold text-xs ml-1">{energy}/{maxEnergy}</span>
        </div>
    );
}
