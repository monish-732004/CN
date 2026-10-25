'use client'
import { useEffect, useRef } from 'react'
import { getPusherClient } from '@/lib/pusher-client'
import { EVENTS } from '@/lib/pusher'
import { useGameStore } from './useGameState'
import { PublicQuestion, PublicParticipant, Histogram, LeaderboardEntry, WinnerData } from '@/types'

export function useSocket(eventId: string | null, participantId: string | null) {
  const setSession = useGameStore(s => s.setSession)
  const subscribedRef = useRef(false)

  useEffect(() => {
    if (!eventId || subscribedRef.current) return
    subscribedRef.current = true

    const pusher = getPusherClient()
    const quizChannel = pusher.subscribe(`quiz-${eventId}`)

    quizChannel.bind(EVENTS.LOBBY_UPDATED, (data: { participants: PublicParticipant[] }) => {
      setSession({ participants: data.participants })
    })

    quizChannel.bind(EVENTS.GAME_STARTED, (data: { questionNumber: number; totalQuestions: number }) => {
      setSession({ phase: 'question_active', questionNumber: data.questionNumber })
    })

    quizChannel.bind(EVENTS.QUESTION_STARTED, (data: { question: PublicQuestion; deadline: number; questionNumber: number }) => {
      setSession({
        currentQuestion: data.question,
        deadline: data.deadline,
        questionNumber: data.questionNumber,
        phase: 'question_active',
        myAnswer: null,
        histogram: null,
        correctOption: null,
        explanation: null,
        correctnessByPlayer: {},
      })
    })

    quizChannel.bind(EVENTS.QUESTION_CLOSED, () => {
      setSession({ phase: 'question_closed' })
    })

    quizChannel.bind(EVENTS.ANSWER_REVEALED, (data: { histogram: Histogram; correctOption: string; explanation: string; correctnessByPlayer: Record<string, boolean> }) => {
      setSession({
        histogram: data.histogram,
        correctOption: data.correctOption,
        explanation: data.explanation,
        phase: 'revealed',
        correctnessByPlayer: data.correctnessByPlayer ?? {},
      })
    })

    quizChannel.bind(EVENTS.LEADERBOARD_UPDATED, (data: { leaderboard: LeaderboardEntry[] }) => {
      setSession({ leaderboard: data.leaderboard })
    })

    quizChannel.bind(EVENTS.GAME_PAUSED, () => {
      setSession({ isPaused: true })
    })

    quizChannel.bind(EVENTS.GAME_RESUMED, (data: { deadline: number }) => {
      setSession({ isPaused: false, deadline: data.deadline })
    })

    quizChannel.bind(EVENTS.GAME_FINISHED, (data: { winner: WinnerData; finalLeaderboard: LeaderboardEntry[] }) => {
      setSession({ winner: data.winner, leaderboard: data.finalLeaderboard, phase: 'finished' })
    })

    // Subscribe to private player channel
    let playerChannel: ReturnType<typeof pusher.subscribe> | null = null
    if (participantId) {
      playerChannel = pusher.subscribe(`private-player-${participantId}`)
      playerChannel.bind(EVENTS.SCORE_UPDATED, (data: { correctCount: number; accuracy: number; wasCorrect: boolean; questionId: string }) => {
        setSession({ correctCount: data.correctCount })
      })
      playerChannel.bind(EVENTS.PLAYER_REMOVED, () => {
        window.location.href = '/?removed=true'
      })
    }

    return () => {
      quizChannel.unbind_all()
      pusher.unsubscribe(`quiz-${eventId}`)
      if (participantId && playerChannel) {
        playerChannel.unbind_all()
        pusher.unsubscribe(`private-player-${participantId}`)
      }
      subscribedRef.current = false
    }
  }, [eventId, participantId, setSession])
}
