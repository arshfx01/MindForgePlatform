"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { ArenaSplitLayout } from "@/components/arena/ArenaSplitLayout";
import { OracleFeedback, type Evaluation } from "@/components/arena/OracleFeedback";
import { useGameStore } from "@/store/gameStore";
import { generateScenario, evaluateSubmission } from "@/services/ai/oracle";
import { Loader2, Send, BrainCircuit } from "lucide-react";
import { saveScenarioResult } from "@/app/actions/game";
import { motion } from "framer-motion";

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
        setPointsEarned
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
        const text = await generateScenario(activeLevel, stats);
        setScenarioText(text);
        setLoading(false);
        setHasStarted(true);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const result = await evaluateSubmission(scenarioText, input);
        setEvaluation(result);

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
            <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">The Arena</h1>
                        <p className="text-muted-foreground">High-stakes cognitive evaluation protocol. Level {activeLevel}.</p>
                    </div>

                    <div className="bg-card border-2 border-primary/20 p-8 rounded-3xl shadow-2xl space-y-6">
                        <div className="flex justify-around text-sm font-mono uppercase tracking-widest text-muted-foreground">
                            <div className="flex flex-col items-center">
                                <span className="text-primary font-bold">5:00</span>
                                <span className="text-xs uppercase">Limit</span>
                            </div>
                            <div className="flex flex-col items-center border-x border-border px-8">
                                <span className="text-primary font-bold">-{1}</span>
                                <span className="text-xs uppercase">Energy</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-primary font-bold">2X</span>
                                <span className="text-xs uppercase">Multi</span>
                            </div>
                        </div>

                        <button
                            onClick={startScenario}
                            className="w-full py-6 bg-primary text-primary-foreground rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(var(--primary),0.3)] group"
                        >
                            INITIALIZE PROTOCOL
                        </button>

                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="text-xs text-muted-foreground hover:text-primary underline"
                        >
                            {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background h-screen" : "h-[calc(100vh-4rem)]"}`}>
            <div className="bg-muted/50 p-2 flex justify-between items-center px-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold text-primary">PROTOCOL STATUS: ACTIVE</span>
                    <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: "100%" }}
                            animate={{ width: `${(timeLeft / 300) * 100}%` }}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-2xl font-mono font-black text-primary tabular-nums">
                        {formatTime(timeLeft)}
                    </div>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1 hover:bg-muted rounded"
                    >
                        <BrainCircuit className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <ArenaSplitLayout
                scenario={
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="animate-spin text-primary" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-foreground">Consulting the Oracle...</span>
                                    <span className="text-xs">Assembling Level {activeLevel} Crisis Data</span>
                                </div>
                            </div>
                        ) : (
                            scenarioText.split("\n").map((line, i) => {
                                if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground mb-4">{line.replace("# ", "")}</h1>
                                if (line.startsWith("**")) return <p key={i} className="font-bold mt-4 text-primary/80">{line.replace(/\*\*/g, "")}</p>
                                if (line.trim().startsWith("-")) return <li key={i} className="ml-4 list-disc opacity-90">{line.replace("-", "").trim()}</li>
                                return <p key={i} className="leading-relaxed opacity-90 mb-2">{line}</p>
                            })
                        )}
                    </div>
                }
                editor={
                    <div className="h-full flex flex-col gap-4">
                        {evaluation ? (
                            <div className="flex-1 overflow-auto custom-scrollbar">
                                <OracleFeedback evaluation={evaluation} />
                                <button
                                    onClick={() => {
                                        setEvaluation(null);
                                        setInput("");
                                        setHasStarted(false);
                                    }}
                                    className="mt-6 w-full py-4 bg-secondary text-secondary-foreground rounded-xl hover:brightness-110 transition-all font-bold border border-secondary shadow-lg active:scale-[0.98]"
                                >
                                    Transmit New Inquiry
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 relative">
                                    <textarea
                                        className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed p-4 border border-border/50 rounded-xl bg-muted/5 focus:border-primary/50 transition-colors"
                                        placeholder="Draft your ethical defense or logical resolution here... The Oracle awaits."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                    <div className="absolute top-2 right-2 opacity-20 pointer-events-none">
                                        <BrainCircuit className="w-12 h-12" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-border">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !input.trim() || timeLeft <= 0}
                                        className="flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:brightness-110 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Calibrating Analytics...</>
                                        ) : (
                                            <><Send className="w-5 h-5" /> Execute Protocol</>
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
