// Adapted from Shadcn UI Chart Component
"use client"

import * as React from "react"
import { ResponsiveContainer, Tooltip } from "recharts"

import { cn } from "@/lib/utils"

// Format: { themes: { light: string, dark: string }, cssVars: { light: ..., dark: ... } }
export type ChartConfig = Record<
    string,
    {
        label?: React.ReactNode
        icon?: React.ComponentType
        color?: string
        theme?: Record<string, string>
    }
>

interface ChartContextProps {
    config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
    const context = React.useContext(ChartContext)
    if (!context) {
        throw new Error("useChart must be used within a <ChartContainer />")
    }
    return context
}

export const ChartContainer = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
        config: ChartConfig
        children: React.ComponentProps<typeof ResponsiveContainer>["children"]
    }
>(({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId()
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                data-chart={chartId}
                ref={ref}
                className={cn(
                    "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
                    className
                )}
                {...props}
            >
                <ResponsiveContainer>
                    {children}
                </ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    )
})
ChartContainer.displayName = "ChartContainer"

export const ChartTooltip = Tooltip

export const ChartTooltipContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof Tooltip> & {
        hideLabel?: boolean
        hideIndicator?: boolean
        indicator?: "line" | "dot" | "dashed"
        nameKey?: string
        labelKey?: string
        payload?: any[]
        active?: boolean
        className?: string
        label?: any
        color?: string
    }
>(
    (
        {
            active,
            payload,
            className,
            indicator = "dot",
            hideLabel = false,
            hideIndicator = false,
            label,
            labelFormatter,
            labelClassName,
            formatter,
            color,
            nameKey,
            labelKey,
        },
        ref
    ) => {
        const { config } = useChart()

        if (!active || !payload?.length) {
            return null
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
                    className
                )}
            >
                {/* Simplified Tooltip Content for MVP */}
                <div className="grid gap-1.5">
                    {payload.map((item: any, index: number) => {
                        const key = item.dataKey || item.name || "value"
                        const itemConfig = config[key as keyof typeof config] || config.value

                        return (
                            <div key={index} className="flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground">
                                <div className="flex flex-1 justify-between leading-none items-center">
                                    <div className="grid gap-1.5">
                                        <span className="text-muted-foreground">{item.payload.subject || "Value"}</span>
                                        <span className="font-mono font-medium tabular-nums text-foreground">
                                            {item.value} / {item.payload.fullMark}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
)
ChartTooltipContent.displayName = "ChartTooltipContent"
