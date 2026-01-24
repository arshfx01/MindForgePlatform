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
            <div className="glass-card flex items-center gap-6 p-8 rounded-2xl relative overflow-hidden group">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[80px] -mr-10 -mt-10 group-hover:bg-primary/30 transition-colors duration-500" />

                <div className="relative z-10 flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-primary/30 bg-black/50 backdrop-blur-md shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                    <span className="text-4xl font-black font-mono text-white text-glow">{evaluation.score}</span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Score</span>
                </div>

                <div className="flex-1 space-y-2 relative z-10">
                    <h3 className="text-2xl font-bold text-white tracking-tight">Analysis Complete</h3>
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                        {evaluation.summary}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-mono text-sm pt-2">
                        <Zap className="w-4 h-4 fill-current animate-pulse" />
                        <span className="font-bold text-glow">+{evaluation.xp_awarded} XP Awarded</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                    <h4 className="flex items-center gap-2 font-bold text-green-400 mb-4 uppercase tracking-wider text-sm">
                        <CheckCircle className="w-4 h-4" /> Strengths Detected
                    </h4>
                    <ul className="space-y-3">
                        {evaluation.strengths.map((str, i) => (
                            <li key={i} className="flex gap-3 text-sm text-green-100/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                {str}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Fallacies */}
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                    <h4 className="flex items-center gap-2 font-bold text-red-400 mb-4 uppercase tracking-wider text-sm">
                        <AlertTriangle className="w-4 h-4" /> Logical Fallacies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {evaluation.fallacies.map((fal, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-200 text-xs font-mono border border-red-500/30">
                                {fal}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Growth Tip */}
            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex gap-5 items-start backdrop-blur-sm">
                <div className="p-3 rounded-full bg-blue-500/20 border border-blue-500/30 shrink-0">
                    <Lightbulb className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-400 text-sm mb-2 uppercase tracking-wider">Growth Opportunity</h4>
                    <p className="text-sm text-blue-100/80 leading-relaxed font-medium">{evaluation.growth_tip}</p>
                </div>
            </div>
        </div>
    );
}
