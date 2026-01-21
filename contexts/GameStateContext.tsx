"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface GameState {
  xp: number
  level: number
  streak: number
  unlockedScenarios: string[]
}

interface GameStateContextType {
  gameState: GameState
  addXP: (amount: number) => void
  incrementStreak: () => void
  unlockScenario: (scenarioId: string) => void
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined)

const XP_PER_LEVEL = 1000

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    xp: 250,
    level: 1,
    streak: 3,
    unlockedScenarios: ["1", "2", "3"],
  })

  const addXP = (amount: number) => {
    setGameState((prev) => {
      const newXP = prev.xp + amount
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      }
    })
  }

  const incrementStreak = () => {
    setGameState((prev) => ({
      ...prev,
      streak: prev.streak + 1,
    }))
  }

  const unlockScenario = (scenarioId: string) => {
    setGameState((prev) => {
      if (prev.unlockedScenarios.includes(scenarioId)) {
        return prev
      }
      return {
        ...prev,
        unlockedScenarios: [...prev.unlockedScenarios, scenarioId],
      }
    })
  }

  return (
    <GameStateContext.Provider value={{ gameState, addXP, incrementStreak, unlockScenario }}>
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState() {
  const context = useContext(GameStateContext)
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider")
  }
  return context
}

