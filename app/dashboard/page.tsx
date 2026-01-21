"use client"

import { useGameState } from "@/contexts/GameStateContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, TrendingUp, Brain, Scale, Trophy } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const scenarios = [
  { id: "1", title: "The Ethical Dilemma", description: "A company faces a moral crossroads", unlocked: true },
  { id: "2", title: "The Logical Paradox", description: "Untangle a web of contradictions", unlocked: true },
  { id: "3", title: "The Cognitive Bias", description: "Identify hidden assumptions", unlocked: true },
  { id: "4", title: "The Strategic Decision", description: "Navigate complex trade-offs", unlocked: false },
  { id: "5", title: "The Argument Analysis", description: "Deconstruct persuasive rhetoric", unlocked: false },
]

export default function DashboardPage() {
  const { gameState } = useGameState()

  const stats = [
    {
      title: "Logic Prowess",
      value: "87",
      icon: Brain,
      color: "text-primary",
    },
    {
      title: "Cognitive Flexibility",
      value: "72",
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      title: "Ethical Nuance",
      value: "91",
      icon: Scale,
      color: "text-amber-400",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Thinker</p>
        </div>
        <Link href="/leaderboard">
          <Button variant="outline" className="gap-2">
            <Trophy className="h-4 w-4" />
            View Leaderboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>The Path</CardTitle>
            <CardDescription>Your journey through critical thinking scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scenarios.map((scenario, index) => {
                const isUnlocked = gameState.unlockedScenarios.includes(scenario.id) || scenario.unlocked
                return (
                  <div
                    key={scenario.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      isUnlocked
                        ? "border-primary/50 bg-card/50 hover:bg-card"
                        : "border-border bg-background/50 opacity-50"
                    }`}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{scenario.title}</h3>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    </div>
                    {isUnlocked ? (
                      <Link href={`/arena/${scenario.id}`}>
                        <Button size="sm">Enter</Button>
                      </Link>
                    ) : (
                      <Badge variant="outline">Locked</Badge>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Streak</CardTitle>
            <CardDescription>Keep your momentum going</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <Flame className="h-16 w-16 text-amber-400 mb-4" />
              <div className="text-4xl font-bold mb-2">{gameState.streak}</div>
              <p className="text-sm text-muted-foreground">Days in a row</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

