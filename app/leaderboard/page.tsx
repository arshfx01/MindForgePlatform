"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

const leaderboardData = [
  { rank: 1, username: "Socrates", title: "Grand Inquisitor", xp: 15420, icon: Trophy },
  { rank: 2, username: "Aristotle", title: "Master Logician", xp: 12850, icon: Medal },
  { rank: 3, username: "Plato", title: "Dialectical Sage", xp: 11230, icon: Award },
  { rank: 4, username: "Descartes", title: "Rational Thinker", xp: 9870, icon: Award },
  { rank: 5, username: "Kant", title: "Ethical Philosopher", xp: 8450, icon: Award },
  { rank: 6, username: "Hume", title: "Empirical Analyst", xp: 7230, icon: Award },
  { rank: 7, username: "Nietzsche", title: "Critical Examiner", xp: 6120, icon: Award },
  { rank: 8, username: "Russell", title: "Logical Positivist", xp: 5340, icon: Award },
  { rank: 9, username: "Wittgenstein", title: "Language Analyst", xp: 4560, icon: Award },
  { rank: 10, username: "Rawls", title: "Justice Theorist", xp: 3890, icon: Award },
]

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">Top thinkers in the MindForge community</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Rankings</CardTitle>
          <CardDescription>Compete with the best critical thinkers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-muted-foreground font-medium">Rank</th>
                  <th className="text-left py-4 px-4 text-muted-foreground font-medium">User</th>
                  <th className="text-left py-4 px-4 text-muted-foreground font-medium">Title</th>
                  <th className="text-right py-4 px-4 text-muted-foreground font-medium">Total XP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((user) => {
                  const Icon = user.icon
                  return (
                    <tr
                      key={user.rank}
                      className="border-b border-border/50 hover:bg-card/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-5 w-5 ${
                              user.rank === 1
                                ? "text-amber-400"
                                : user.rank === 2
                                ? "text-muted-foreground"
                                : user.rank === 3
                                ? "text-amber-600"
                                : "text-muted-foreground/60"
                            }`}
                          />
                          <span className="font-semibold">#{user.rank}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">{user.username}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary">{user.title}</Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-semibold text-primary">{user.xp.toLocaleString()}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

