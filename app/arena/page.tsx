"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { ArenaImmersiveLayout } from "@/components/arena/ArenaImmersiveLayout";
import { OracleFeedback, type Evaluation } from "@/components/arena/OracleFeedback";
import { useGameStore } from "@/store/gameStore";
import { generateScenario, evaluateSubmission } from "@/services/ai/oracle";
import { Loader2, Send, BrainCircuit, Play, AlertCircle } from "lucide-react";
import { saveScenarioResult } from "@/app/actions/game";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ArenaContent() {
    const searchParams = useSearchParams();
    const queryLevel = searchParams.get("level");

    const [input, setInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

    const activeLevel = queryLevel ? parseInt(queryLevel) : storeLevel;

    const [scenarioText, setScenarioText] = useState("Loading scenario...");
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(300);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

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
        setError(null);
        if (energy <= 0) {
            setError("Insufficient energy units. Neutralize recovery protocol engaged. Please wait for replenishment.");
            return;
        }

        setIsInitializing(true);
        const ok = await consumeEnergy();
        if (!ok) {
            setIsInitializing(false);
            return;
        }

        setLoading(true);
        try {
            const text = await generateScenario(activeLevel, stats, lastArenaScore || undefined);
            setScenarioText(text);
            setLoading(false);
            setHasStarted(true);
        } catch (err: any) {
            setError(err.message || "Failed to establish secure logic link. Please attempt reconnection.");
        } finally {
            setIsInitializing(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await evaluateSubmission(scenarioText, input);
            setEvaluation(result);
            setLastArenaScore(result.score);

            const xpGained = result.xp_awarded;
            setPointsEarned(xpGained);

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

                updateProfile({
                    xp: (useGameStore.getState().xp || 0) + xpGained,
                    stats: {
                        logic: stats.logic + (result.new_stats?.logic || 0),
                        flexibility: stats.flexibility + (result.new_stats?.flexibility || 0),
                        ethics: stats.ethics + (result.new_stats?.ethics || 0),
                    }
                });
            }
        } catch (err: any) {
            setError(err.message || "Transmission error during evaluation. Logic engine stalled.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!hasStarted) {
        return (
            <div className={`relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 overflow-hidden bg-[#fafafa] ${isFullscreen ? "fixed inset-0 z-50 bg-[#fafafa]" : ""}`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />

                <div className="absolute top-4 left-4 z-20">
                    <BackButton />
                </div>

                <div className="max-w-2xl w-full text-center space-y-10 relative z-10">
                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-7xl font-black tracking-tighter uppercase text-foreground leading-[0.8]"
                        >
                            The Arena
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xs font-bold text-muted-foreground/60 tracking-[0.4em] uppercase"
                        >
                            Cognitive Protocol • Instance {activeLevel}
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-white border border-border/60 p-12 rounded-[3rem] shadow-sm space-y-10"
                    >
                        {error && (
                            <Alert variant="destructive" className="text-left animate-in fade-in slide-in-from-top-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>System Alert</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
                            <div className="flex flex-col items-center space-y-2">
                                <span className="text-3xl font-black text-foreground tabular-nums tracking-tighter">5:00</span>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold italic opacity-60">Time Limit</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 border-y sm:border-y-0 sm:border-x border-border/40 py-6 sm:py-0">
                                <span className="text-3xl font-black text-foreground tabular-nums tracking-tighter">10</span>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold italic opacity-60">Energy Units</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <span className="text-3xl font-black text-primary tabular-nums tracking-tighter">2.0X</span>
                                <span className="text-[10px] uppercase tracking-widest text-primary font-bold italic opacity-60">XP Yield</span>
                            </div>
                        </div>

                        <Button
                            onClick={startScenario}
                            loading={isInitializing}
                            className="w-full h-20 text-lg font-black tracking-widest uppercase rounded-3xl shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            <Play className="w-5 h-5 fill-current mr-2" />
                            Initialize Trial
                        </Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <main className={`flex flex-col bg-[#fafafa] ${isFullscreen ? "fixed inset-0 z-50 h-screen" : "min-h-[calc(100vh-4rem)] h-auto lg:h-[calc(100vh-4rem)]"}`}>
            <header className="h-16 px-6 flex items-center justify-between border-b border-border/40 bg-white/80 backdrop-blur-md z-20 sticky top-0 lg:static">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setHasStarted(false)}
                        className="text-muted-foreground/60 hover:text-foreground transition-colors group flex items-center gap-2"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest">Terminate Session</span>
                    </button>

                    <div className="h-4 w-[1px] bg-border/40" />

                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-primary animate-pulse tracking-widest uppercase">Live Protocol</span>
                        <div className="h-1 w-24 bg-primary/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "100%" }}
                                animate={{ width: `${(timeLeft / 300) * 100}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-foreground">
                    <div className="text-2xl font-black tabular-nums tracking-tighter">
                        {formatTime(timeLeft)}
                    </div>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:bg-muted/50 rounded-full text-muted-foreground transition-all active:scale-90"
                    >
                        <BrainCircuit className="w-5 h-5" />
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
                                <div className="flex flex-col items-center justify-center h-[400px] gap-6 text-muted-foreground">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/5 blur-[40px] rounded-full animate-pulse" />
                                        <Loader2 className="w-10 h-10 animate-spin text-primary relative z-10 opacity-60" />
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="font-bold text-sm tracking-[0.3em] uppercase opacity-40">Connecting to Oracle</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {scenarioText.split("\n").map((line, i) => {
                                        if (line.startsWith("# ")) return <h1 key={i} className="text-3xl font-black text-foreground mb-8 tracking-tight">{line.replace("# ", "")}</h1>
                                        if (line.startsWith("**")) return <p key={i} className="font-bold mt-8 text-primary text-sm uppercase tracking-widest">{line.replace(/\*\*/g, "")}</p>
                                        if (line.trim().startsWith("-")) return <li key={i} className="ml-5 list-disc text-muted-foreground/80 marker:text-primary/40 leading-relaxed">{line.replace("-", "").trim()}</li>
                                        return <p key={i} className="leading-relaxed text-foreground/70 text-lg mb-4">{line}</p>
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                }
                editor={
                    <div className="h-full flex flex-col gap-4">
                        {evaluation ? (
                            <div className="flex-1 overflow-auto custom-scrollbar p-1">
                                <OracleFeedback evaluation={evaluation} />
                                <Button
                                    onClick={() => {
                                        setEvaluation(null);
                                        setInput("");
                                        setHasStarted(false);
                                    }}
                                    className="mt-8 w-full h-14 font-black uppercase tracking-widest shadow-lg shadow-primary/5"
                                >
                                    Proceed to Next Trial
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 relative group">
                                    <textarea
                                        className="w-full h-full bg-muted/20 resize-none focus:outline-none font-sans text-base leading-relaxed p-8 rounded-[1.5rem] border border-border/40 text-foreground transition-all placeholder:text-muted-foreground/30 focus:bg-white focus:border-primary/20 shadow-inner"
                                        placeholder="Draft your reasoning here... Identify cognitive biases, evaluate evidence, and present your synthesis."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        spellCheck={false}
                                    />
                                </div>
                                <div className="flex justify-between items-center pt-2 px-2">
                                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
                                        {input.length} Character Synthesis
                                    </span>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !input.trim() || timeLeft <= 0}
                                        loading={isSubmitting}
                                        className="h-14 px-10 font-black tracking-[0.2em] shadow-xl shadow-primary/10"
                                    >
                                        Execute Analysis
                                    </Button>
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
