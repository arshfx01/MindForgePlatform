"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export function XPOverlay() {
    const { xp } = useGameStore();
    const [diff, setDiff] = useState(0);
    const [prevXP, setPrevXP] = useState(xp);
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (xp > prevXP) {
            setDiff(xp - prevXP);
            setKey(prev => prev + 1);

            // Auto hide after animation
            const timer = setTimeout(() => setDiff(0), 2000);
            return () => clearTimeout(timer);
        }
        setPrevXP(xp);
    }, [xp, prevXP]);

    return (
        <AnimatePresence>
            {diff > 0 && (
                <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 50, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.8 }}
                    className="fixed bottom-24 right-4 md:bottom-20 md:right-8 z-40 pointer-events-none"
                >
                    <div className="flex items-center gap-2 px-6 py-3 bg-primary/20 backdrop-blur-md border border-primary/50 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.5)]">
                        <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        <span className="text-2xl font-black italic text-primary">+{diff} XP</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
