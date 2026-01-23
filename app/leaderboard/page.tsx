"use client"

import { useEffect, useState } from "react"
import { getLeaderboard } from "@/app/actions/game"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Loader2 } from "lucide-react"

export default function LeaderboardPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      const leaderboard = await getLeaderboard(10)
      if (leaderboard) {
        setData(leaderboard)
      }
      setLoading(false)
    }
    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white">Leaderboard</h1>
        <p className="text-muted-foreground">Top thinkers in the MindForge community</p>
      </div>

      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="text-white">Global Rankings</CardTitle>
          <CardDescription>Compete with the best critical thinkers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-muted-foreground font-medium uppercase text-xs tracking-wider">Rank</th>
                  <th className="text-left py-4 px-4 text-muted-foreground font-medium uppercase text-xs tracking-wider">User ID</th>
                  <th className="text-left py-4 px-4 text-muted-foreground font-medium uppercase text-xs tracking-wider">Level</th>
                  <th className="text-right py-4 px-4 text-muted-foreground font-medium uppercase text-xs tracking-wider">Total XP</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => {
                  const rank = index + 1
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-border/50 hover:bg-card/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {rank === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                          {rank === 2 && <Medal className="h-5 w-5 text-emerald-300" />}
                          {rank === 3 && <Award className="h-5 w-5 text-amber-600" />}
                          {rank > 3 && <Award className="h-5 w-5 text-muted-foreground/40" />}
                          <span className="font-semibold text-white">#{rank}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-white">
                          Analyst_{user.id?.slice(-4) || '??'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20">
                          Lvl {user.level || 1}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-mono font-bold text-primary">{(user.xp || 0).toLocaleString()}</span>
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

