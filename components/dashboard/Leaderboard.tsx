"use client";

import { useEffect, useState } from "react";
// import { supabase } from "@/services/supabase/client"; // REMOVED
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, getDocs } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Crown } from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardEntry {
    id: string;
    username: string;
    xp: number;
    level: number;
    avatar_url?: string;
}

export function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch initially
        async function fetchData() {
            try {
                const q = query(collection(db, "profiles"), orderBy("xp", "desc"), limit(10));
                const querySnapshot = await getDocs(q);
                const mapped = querySnapshot.docs.map((doc, i) => {
                    const d = doc.data();
                    return {
                        id: doc.id,
                        username: d.fullName || `MindHacker_${doc.id.substring(0, 4)}`,
                        xp: d.xp || 0,
                        level: d.level || 1
                    } as LeaderboardEntry;
                });
                setEntries(mapped);
                setLoading(false);
            } catch (error) {
                console.error("Leaderboard fetch error:", error);
                setLoading(false);
            }
        }

        fetchData();

        // Realtime Subscription (Optional, for now just fetch once or simple poll)
        // const unsub = onSnapshot(...)

    }, []);

    if (loading) return <div className="h-40 animate-pulse bg-muted/20 rounded-xl" />;

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-bold">Global Neural Network</h3>
            </div>

            <div className="space-y-4">
                {entries.length === 0 ? (
                    <div className="text-center text-muted-foreground">No entries yet.</div>
                ) : (
                    entries.map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 flex justify-center font-mono font-bold text-muted-foreground">
                                    {index === 0 && <Crown className="w-5 h-5 text-yellow-400" />}
                                    {index === 1 && <Medal className="w-5 h-5 text-gray-300" />}
                                    {index === 2 && <Medal className="w-5 h-5 text-amber-600" />}
                                    {index > 2 && `#${index + 1}`}
                                </div>
                                <Avatar className="w-8 h-8 border border-border">
                                    <AvatarFallback className="text-xs">{entry.username[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{entry.username}</p>
                                    <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                                </div>
                            </div>
                            <div className="font-mono font-bold text-primary">
                                {entry.xp.toLocaleString()} XP
                            </div>
                        </motion.div>
                    )))}
            </div>
        </div>
    );
}
