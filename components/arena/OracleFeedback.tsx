"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Lightbulb, Zap } from "lucide-react";

export type Evaluation = {
    score: number;
    xp_awarded: number;
    summary: string;
    fallacies: string[];
    strengths: string[];
    growth_tip: string;
};

export function OracleFeedback({ evaluation }: { evaluation: Evaluation }) {
    if (!evaluation) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Score Card */}
            <div className="flex items-center gap-6 p-6 bg-card border border-border rounded-xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />

                <div className="relative z-10 flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 border-primary/20 bg-background">
                    <span className="text-3xl font-bold font-mono">{evaluation.score}</span>
                    <span className="text-xs text-muted-foreground uppercase">Score</span>
                </div>

                <div className="flex-1 space-y-2 relative z-10">
                    <h3 className="text-xl font-bold">Analysis Complete</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {evaluation.summary}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-mono text-sm pt-2">
                        <Zap className="w-4 h-4" />
                        <span>+{evaluation.xp_awarded} XP Awarded</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                    <h4 className="flex items-center gap-2 font-semibold text-green-500 mb-3">
                        <CheckCircle className="w-4 h-4" /> Strengths
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {evaluation.strengths.map((str, i) => (
                            <li key={i}>{str}</li>
                        ))}
                    </ul>
                </div>

                {/* Fallacies */}
                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <h4 className="flex items-center gap-2 font-semibold text-destructive mb-3">
                        <AlertTriangle className="w-4 h-4" /> Fallacies Detected
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {evaluation.fallacies.map((fal, i) => (
                            <span key={i} className="px-2 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-mono border border-destructive/20">
                                {fal}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Growth Tip */}
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 flex gap-4 items-start">
                <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-semibold text-blue-500 text-sm mb-1">Growth Opportunity</h4>
                    <p className="text-sm text-muted-foreground">{evaluation.growth_tip}</p>
                </div>
            </div>
        </div>
    );
}
