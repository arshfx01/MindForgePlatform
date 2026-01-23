"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export function StreakOverlay() {
    const { streak, userId } = useGameStore();
    const [show, setShow] = useState(false);
    const [prevStreak, setPrevStreak] = useState(streak);

    useEffect(() => {
        // Simple logic: if streak increases, show animation
        if (streak > prevStreak && prevStreak > 0) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 3000);
            return () => clearTimeout(timer);
        }
        setPrevStreak(streak);
    }, [streak, prevStreak]);

    // Separate check for "First time today" handled by the Store action return value typically, 
    // but here we react to state changes.

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.5, y: 100 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.5, y: -100 }}
                        className="flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/50 shadow-[0_0_50px_rgba(234,88,12,0.5)]"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <Flame className="w-32 h-32 text-orange-500 fill-orange-500 animate-pulse" />
                        </motion.div>
                        <h1 className="text-4xl font-bold text-white mt-4 font-mono">STREAK IGNITED!</h1>
                        <p className="text-xl text-orange-200 mt-2">{streak} Day Persistence</p>
                        <p className="text-sm text-muted-foreground mt-4">+50 XP Bonus</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
