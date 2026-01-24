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
    <div className="container mx-auto px-4 md:px-8 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">Top thinkers in the MindForge community</p>
      </div>

      <Card className="bg-white border-border/40 shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold tracking-tight">Global Rankings</CardTitle>
          <CardDescription className="text-xs uppercase tracking-widest font-medium">Top thinkers in the MindForge community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-5 px-6 text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Rank</th>
                  <th className="text-left py-5 px-6 text-muted-foreground font-bold uppercase text-[10px] tracking-widest">User Profile</th>
                  <th className="text-left py-5 px-6 text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Level</th>
                  <th className="text-right py-5 px-6 text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Total XP</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => {
                  const rank = index + 1
                  return (
                    <tr
                      key={user.id}
                      className="group border-b border-border/30 last:border-0 hover:bg-muted/30 transition-all"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          {rank === 1 && <Trophy className="h-5 w-5 text-amber-500" />}
                          {rank === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                          {rank === 3 && <Award className="h-5 w-5 text-amber-700" />}
                          {rank > 3 && <div className="h-5 w-5 rounded-full bg-muted/50 flex items-center justify-center text-[10px] font-bold text-muted-foreground">#</div>}
                          <span className="font-bold text-sm tracking-tight text-foreground">#{rank}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center font-bold text-[10px] text-primary border border-primary/10 tracking-widest">
                            MF
                          </div>
                          <span className="font-bold text-sm text-foreground tracking-tight">
                            Analyst_{user.id?.slice(-4) || '??'}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <Badge variant="secondary" className="bg-primary/[0.03] text-primary border-primary/10 font-bold text-[10px] px-3">
                          LEVEL {user.level || 1}
                        </Badge>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <span className="font-mono font-bold text-sm text-primary tracking-tighter">{(user.xp || 0).toLocaleString()}</span>
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

