"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { ArenaImmersiveLayout } from "@/components/arena/ArenaImmersiveLayout";
import { OracleFeedback, type Evaluation } from "@/components/arena/OracleFeedback";
import { useGameStore } from "@/store/gameStore";
import { generateScenario, evaluateSubmission } from "@/services/ai/oracle";
import { Loader2, Send, BrainCircuit, Play } from "lucide-react";
import { saveScenarioResult } from "@/app/actions/game";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";

function ArenaContent() {
    const searchParams = useSearchParams();
    const queryLevel = searchParams.get("level");

    const [input, setInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
    const {
        userId,
        level: storeLevel,
        updateProfile,
        stats,
        energy,
        consumeEnergy,
        setPointsEarned,
        lastArenaScore,
        setLastArenaScore
    } = useGameStore();


    // Priority: URL Param Level > Store Level
    const activeLevel = queryLevel ? parseInt(queryLevel) : storeLevel;

    const [scenarioText, setScenarioText] = useState("Loading scenario...");
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    // Timer logic
    useEffect(() => {
        if (hasStarted && timeLeft > 0 && !evaluation) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [hasStarted, timeLeft, evaluation]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const startScenario = async () => {
        if (energy <= 0) {
            alert("Insufficient energy. Replenish needed.");
            return;
        }

        const ok = await consumeEnergy();
        if (!ok) return;

        setLoading(true);
        const text = await generateScenario(activeLevel, stats, lastArenaScore || undefined);
        setScenarioText(text);

        setLoading(false);
        setHasStarted(true);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const result = await evaluateSubmission(scenarioText, input);
        setEvaluation(result);
        setLastArenaScore(result.score);


        // Update Profile & Save Result
        const xpGained = result.xp_awarded;
        setPointsEarned(xpGained); // Trigger animation

        if (userId) {
            await saveScenarioResult(
                userId,
                null,
                {
                    scenario: scenarioText,
                    response: input,
                    evaluation: result
                },
                xpGained,
                result.new_stats
            );

            // Optimistic Update
            updateProfile({
                xp: (useGameStore.getState().xp || 0) + xpGained,
                stats: {
                    logic: stats.logic + (result.new_stats?.logic || 0),
                    flexibility: stats.flexibility + (result.new_stats?.flexibility || 0),
                    ethics: stats.ethics + (result.new_stats?.ethics || 0),
                }
            });
        }

        setIsSubmitting(false);
    };

    if (!hasStarted) {
        return (
            <div className={`relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 overflow-hidden bg-background ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
                {/* Background ambient light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="absolute top-4 left-4 z-20">
                    <BackButton />
                </div>

                <div className="max-w-2xl w-full text-center space-y-12 relative z-10">
                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary text-glow drop-shadow-2xl"
                        >
                            The Arena
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-muted-foreground font-mono tracking-widest uppercase"
                        >
                            Cognitive Evaluation Protocol • Level {activeLevel}
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-10 rounded-[32px] border-primary/20 space-y-8"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center">
                            <div className="flex flex-col items-center space-y-1 md:space-y-2">
                                <span className="text-3xl md:text-4xl font-black text-primary tabular-nums">5:00</span>
                                <span className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground font-bold">Time Limit</span>
                            </div>
                            <div className="flex flex-col items-center space-y-1 md:space-y-2 border-y sm:border-y-0 sm:border-x border-white/10 py-4 sm:py-0">
                                <span className="text-3xl md:text-4xl font-black text-white tabular-nums">10</span>
                                <span className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground font-bold">Energy Cost</span>
                            </div>
                            <div className="flex flex-col items-center space-y-1 md:space-y-2">
                                <span className="text-3xl md:text-4xl font-black text-secondary tabular-nums">2X</span>
                                <span className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground font-bold">XP Multiplier</span>
                            </div>
                        </div>

                        <button
                            onClick={startScenario}
                            className="w-full group relative py-6 bg-primary text-primary-foreground rounded-2xl font-black text-2xl overflow-hidden shadow-[0_0_40px_rgba(var(--primary),0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                <Play className="w-8 h-8 fill-current" />
                                INITIALIZE PROTOCOL
                            </span>
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <main className={`flex flex-col bg-background ${isFullscreen ? "fixed inset-0 z-50 h-screen" : "min-h-[calc(100vh-4rem)] h-auto lg:h-[calc(100vh-4rem)]"}`}>
            <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-md z-20 sticky top-0 lg:static">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setHasStarted(false)}
                        className="text-muted-foreground hover:text-white transition-colors"
                    >
                        <span className="text-xs font-mono font-bold uppercase tracking-widest hidden sm:inline">Abort Mission</span>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest sm:hidden">Exit</span>
                    </button>

                    <div className="h-4 w-[1px] bg-white/10" />

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-primary animate-pulse">ACTIVE PROTOCOL</span>
                        <div className="h-1.5 w-32 bg-secondary/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary box-shadow-[0_0_10px_rgba(var(--primary),1)]"
                                initial={{ width: "100%" }}
                                animate={{ width: `${(timeLeft / 300) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-3xl font-mono font-black text-white tabular-nums tracking-tight">
                        {formatTime(timeLeft)}
                    </div>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"
                    >
                        <BrainCircuit className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <ArenaImmersiveLayout
                scenario={
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={loading ? "loading" : "content"}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-[300px] gap-4 text-muted-foreground">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                                        <Loader2 className="w-12 h-12 animate-spin text-primary relative z-10" />
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="font-bold text-lg text-white font-mono tracking-widest uppercase">Consulting Oracle</span>
                                        <span className="text-xs text-primary/80 uppercase tracking-widest">Retrieving Level {activeLevel} Data...</span>
                                    </div>
                                </div>
                            ) : (
                                scenarioText.split("\n").map((line, i) => {
                                    if (line.startsWith("# ")) return <h1 key={i} className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-white mb-6 tracking-tight">{line.replace("# ", "")}</h1>
                                    if (line.startsWith("**")) return <p key={i} className="font-bold mt-6 text-primary text-lg">{line.replace(/\*\*/g, "")}</p>
                                    if (line.trim().startsWith("-")) return <li key={i} className="ml-4 list-disc text-muted-foreground marker:text-primary">{line.replace("-", "").trim()}</li>
                                    return <p key={i} className="leading-relaxed text-muted-foreground text-lg mb-3">{line}</p>
                                })
                            )}
                        </motion.div>
                    </AnimatePresence>
                }
                editor={
                    <div className="h-full flex flex-col gap-4">
                        {evaluation ? (
                            <div className="flex-1 overflow-auto custom-scrollbar p-2">
                                <OracleFeedback evaluation={evaluation} />
                                <button
                                    onClick={() => {
                                        setEvaluation(null);
                                        setInput("");
                                        setHasStarted(false);
                                    }}
                                    className="mt-6 w-full py-4 bg-secondary text-secondary-foreground rounded-xl hover:brightness-110 transition-all font-bold border border-secondary shadow-[0_0_20px_rgba(var(--secondary),0.4)] active:scale-[0.98] uppercase tracking-widest text-sm"
                                >
                                    Transmit New Inquiry
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 relative group">
                                    <textarea
                                        className="w-full h-full bg-black/40 resize-none focus:outline-none font-mono text-sm leading-relaxed p-6 border border-white/5 rounded-xl text-primary/90 focus:border-primary/50 focus:bg-black/60 transition-all placeholder:text-white/20"
                                        placeholder="> AWAITING INPUT...
> Draft your ethical defense or logical resolution here."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        spellCheck={false}
                                    />
                                    <div className="absolute bottom-4 right-4 opacity-10 group-focus-within:opacity-40 transition-opacity pointer-events-none">
                                        <BrainCircuit className="w-24 h-24 text-primary" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-white/5 px-2">
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                        {input.length} chars
                                    </span>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !input.trim() || timeLeft <= 0}
                                        className="flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all shadow-[0_0_20px_rgba(var(--primary),0.25)] active:scale-[0.98]"
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> PROCESSING...</>
                                        ) : (
                                            <><Send className="w-5 h-5" /> EXECUTE</>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                }
            />
        </main>
    );
}

export default function ArenaPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        }>
            <ArenaContent />
        </Suspense>
    );
}
