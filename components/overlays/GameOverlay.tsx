"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { Flame, Star } from "lucide-react";

export function GameOverlay() {
    const {
        showStreakAnimation,
        setShowStreakAnimation,
        streak,
        pointsEarned,
        setPointsEarned
    } = useGameStore();

    const [isVisible, setIsVisible] = useState(false);
    const [pointsVisible, setPointsVisible] = useState(false);

    useEffect(() => {
        if (showStreakAnimation) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setShowStreakAnimation(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showStreakAnimation]);

    useEffect(() => {
        if (pointsEarned !== null) {
            setPointsVisible(true);
            const timer = setTimeout(() => {
                setPointsVisible(false);
                setPointsEarned(null);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [pointsEarned]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="bg-background/80 backdrop-blur-md p-12 rounded-full border-4 border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.5)] flex flex-col items-center gap-4 pointer-events-auto"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 1 }}
                        >
                            <Flame className="w-24 h-24 text-orange-500 fill-orange-500" />
                        </motion.div>
                        <h2 className="text-4xl font-black text-orange-500 uppercase tracking-tighter">
                            {streak} DAY STREAK!
                        </h2>
                        <p className="text-muted-foreground font-medium">Cognitive Momentum Maintained</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {pointsVisible && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: -100, opacity: 1 }}
                        exit={{ y: -200, opacity: 0 }}
                        className="bg-yellow-500 text-yellow-950 px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-3"
                    >
                        <Star className="w-6 h-6 fill-yellow-950" />
                        <span className="text-2xl">+{pointsEarned} XP</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
