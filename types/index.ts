export interface GameSession {
  eventId: string
  pin: string
  status: 'lobby' | 'active' | 'paused' | 'finished'
  currentQuestionIndex: number
  phase: 'waiting' | 'question_active' | 'question_closed' | 'revealed'
  currentQuestionDeadline: number
  pausedAt?: number
  createdAt: number
  startedAt?: number
  finishedAt?: number
  config: { defaultTimeLimit: number; winnerRule: 'most_correct' }
}

export interface ParticipantInfo {
  participantId: string
  nickname: string
  characterId: string
  joinedAt: number
  eventId: string
}

export interface PublicParticipant {
  participantId: string
  nickname: string
  characterId: string
}

export interface PublicQuestion {
  id: string
  order: number
  text: string
  options: { A: string; B: string; C: string; D: string }
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number
}

export interface Histogram {
  A: number
  B: number
  C: number
  D: number
  total: number
}

export interface LeaderboardEntry {
  participantId: string
  nickname: string
  characterId: string
  correctCount: number
  rank: number
}

export interface WinnerData {
  participants: Array<{ participantId: string; nickname: string; characterId: string; correctCount: number }>
  isSharedWin: boolean
  prize: string
  message: string
}

export interface SessionData {
  eventId: string
  participantId: string
  nickname: string
  characterId: string
}

export interface ScoreUpdate {
  correctCount: number
  accuracy: number
  wasCorrect: boolean
  questionId: string
}

export type AnswerOption = 'A' | 'B' | 'C' | 'D'
