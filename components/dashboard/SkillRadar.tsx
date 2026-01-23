"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useGameStore } from "@/store/gameStore";

const chartConfig = {
    value: {
        label: "Skill Level",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export function SkillRadar() {
    const stats = useGameStore((state) => state.stats);

    const data = [
        { subject: "Logic", value: stats.logic, fullMark: 100 },
        { subject: "Flexibility", value: stats.flexibility, fullMark: 100 },
        { subject: "Ethics", value: stats.ethics, fullMark: 100 },
    ];

    return (
        <div className="w-full h-[300px] flex flex-col items-center justify-center p-4 bg-card rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Cognitive Profile</h3>
            <div className="h-full w-full">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <RadarChart data={data}>
                        <PolarGrid className="fill-[--muted]/20" />
                        <PolarAngleAxis dataKey="subject" />
                        <Radar
                            name="Skill Level"
                            dataKey="value"
                            stroke="var(--color-value)"
                            fill="var(--color-value)"
                            fillOpacity={0.6}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    </RadarChart>
                </ChartContainer>
            </div>
        </div>
    );
}
