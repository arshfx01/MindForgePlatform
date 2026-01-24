"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ArenaImmersiveLayoutProps {
    scenario: React.ReactNode;
    editor: React.ReactNode;
}

export function ArenaImmersiveLayout({ scenario, editor }: ArenaImmersiveLayoutProps) {
    return (
        <div className="relative w-full min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] flex flex-col overflow-y-auto lg:overflow-hidden bg-[#fafafa]">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden h-full">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 z-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none h-full" />

            {/* Main Content Area */}
            <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-8 max-w-[1600px] mx-auto w-full lg:h-full">

                {/* Scenario / Mission Control Display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 lg:flex-[1.2] flex flex-col min-h-[400px] lg:min-h-0 lg:h-full"
                >
                    <div className="bg-white/80 backdrop-blur-md rounded-[2rem] flex flex-col h-full overflow-hidden border border-border/50 shadow-sm">
                        <div className="p-5 border-b border-border/40 bg-white/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase">
                                    Strategic Analysis
                                </span>
                            </div>
                            <div className="text-[10px] font-mono text-muted-foreground/40 hidden sm:block uppercase tracking-widest">
                                Instance: Alpha-01
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-8 lg:p-10 custom-scrollbar relative">
                            <div className="prose prose-neutral prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight max-w-none">
                                {scenario}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Editor / Command Console */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    className="flex-1 lg:h-full flex flex-col min-h-[500px] lg:min-h-0"
                >
                    <div className="bg-white/80 backdrop-blur-md rounded-[2rem] flex flex-col h-full overflow-hidden border border-border/50 shadow-sm">
                        <div className="p-5 border-b border-border/40 bg-white/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                <span className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase">
                                    Editor Workspace
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 p-2 relative flex flex-col">
                            {editor}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}


