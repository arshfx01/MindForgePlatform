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
        <div className="space-y-6 animate-slide-up">
            {/* Score Card */}
            <div className="bg-white border border-border/60 shadow-sm flex items-center gap-6 p-10 rounded-[2.5rem] relative overflow-hidden group">
                {/* Subtle Ambient Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.03] rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-primary/[0.05] transition-colors duration-500" />

                <div className="relative z-10 flex flex-col items-center justify-center w-32 h-32 rounded-full border border-border/40 bg-background shadow-sm">
                    <span className="text-5xl font-black tracking-tighter text-foreground">{evaluation.score}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Score</span>
                </div>

                <div className="flex-1 space-y-1 relative z-10">
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">Analysis Complete</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {evaluation.summary}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs pt-3 uppercase tracking-widest">
                        <Zap className="w-3.5 h-3.5 fill-primary" />
                        <span>+{evaluation.xp_awarded} XP Earned</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-6 rounded-[2rem] bg-emerald-50/50 border border-emerald-100 shadow-sm transition-all hover:bg-emerald-50">
                    <h4 className="flex items-center gap-2 font-bold text-emerald-800 mb-4 uppercase tracking-widest text-[10px]">
                        <CheckCircle className="w-3.5 h-3.5" /> Strengths Detected
                    </h4>
                    <ul className="space-y-3">
                        {evaluation.strengths.map((str, i) => (
                            <li key={i} className="flex gap-3 text-sm text-emerald-900/70 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                {str}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Fallacies */}
                <div className="p-6 rounded-[2rem] bg-red-50/50 border border-red-100 shadow-sm transition-all hover:bg-red-50">
                    <h4 className="flex items-center gap-2 font-bold text-red-800 mb-4 uppercase tracking-widest text-[10px]">
                        <AlertTriangle className="w-3.5 h-3.5" /> Thinking Errors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {evaluation.fallacies.map((fal, i) => (
                            <span key={i} className="px-4 py-2 rounded-full bg-white border border-red-200 text-red-700 text-xs font-bold tracking-tight shadow-sm transition-transform hover:scale-105 cursor-default">
                                {fal}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Growth Tip */}
            <div className="p-8 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 flex gap-6 items-start shadow-sm transition-all hover:bg-indigo-50">
                <div className="p-3.5 rounded-2xl bg-white border border-indigo-100 shrink-0 shadow-sm">
                    <Lightbulb className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                    <h4 className="font-bold text-indigo-900 text-xs mb-1.5 uppercase tracking-widest leading-none">Growth Strategy</h4>
                    <p className="text-sm text-indigo-900/60 leading-relaxed font-medium">{evaluation.growth_tip}</p>
                </div>
            </div>
        </div>
    );
}

