"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

export function ArenaSplitLayout({
    scenario,
    editor,
}: {
    scenario: React.ReactNode;
    editor: React.ReactNode;
}) {
    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
            {/* Scenario Pane */}
            <div className="w-full lg:w-1/3 bg-muted/20 border-r border-border h-1/2 lg:h-full flex flex-col">
                <div className="p-4 border-b border-border bg-card/50 backdrop-blur">
                    <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                        Scenario Data
                    </h2>
                </div>
                <ScrollArea className="flex-1 p-6">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        {scenario}
                    </div>
                </ScrollArea>
            </div>

            {/* Editor Pane */}
            <div className="flex-1 flex flex-col bg-background h-1/2 lg:h-full">
                <div className="p-4 border-b border-border bg-card/50 backdrop-blur flex justify-between items-center">
                    <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                        Analysis Protocol
                    </h2>
                    <span className="text-xs text-muted-foreground">Markdown Supported</span>
                </div>
                <div className="flex-1 p-6 relative">
                    {editor}
                </div>
            </div>
        </div>
    );
}
