'use client'
import { create } from 'zustand'
import { GameSession, LeaderboardEntry, WinnerData, PublicQuestion, PublicParticipant, Histogram } from '@/types'

interface GameStore {
  // Session
  sessionToken: string | null
  participantId: string | null
  nickname: string | null
  characterId: string | null
  eventId: string | null

  // Game state
  gameSession: GameSession | null
  participants: PublicParticipant[]
  currentQuestion: PublicQuestion | null
  questionNumber: number
  deadline: number
  histogram: Histogram | null
  correctOption: string | null
  explanation: string | null
  myAnswer: string | null
  correctCount: number
  leaderboard: LeaderboardEntry[]
  winner: WinnerData | null
  correctnessByPlayer: Record<string, boolean>

  // UI state
  phase: 'lobby' | 'question_active' | 'question_closed' | 'revealed' | 'finished'
  isPaused: boolean

  // Actions
  setSession: (data: Partial<GameStore>) => void
  setAnswer: (answer: string) => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  sessionToken: null,
  participantId: null,
  nickname: null,
  characterId: null,
  eventId: null,
  gameSession: null,
  participants: [],
  currentQuestion: null,
  questionNumber: 0,
  deadline: 0,
  histogram: null,
  correctOption: null,
  explanation: null,
  myAnswer: null,
  correctCount: 0,
  leaderboard: [],
  winner: null,
  correctnessByPlayer: {},
  phase: 'lobby',
  isPaused: false,

  setSession: (data) => set(state => ({ ...state, ...data })),
  setAnswer: (answer) => set({ myAnswer: answer }),
  reset: () => set({
    gameSession: null, currentQuestion: null, histogram: null,
    correctOption: null, explanation: null, myAnswer: null,
    correctCount: 0, leaderboard: [], winner: null, phase: 'lobby',
    isPaused: false,
  }),
}))
