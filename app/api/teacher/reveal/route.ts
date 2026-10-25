import { NextResponse } from 'next/server'
import { pusherServer, CHANNELS, EVENTS } from '@/lib/pusher'
import { verifyTeacherToken, getTeacherToken } from '@/lib/teacher-auth'
import { getGameSession, updateGameSession, getAllParticipants, getLeaderboard } from '@/lib/game/GameSession'
import { calculateHistogram, getPlayerAnswer } from '@/lib/game/HistogramService'
import { scoreQuestion, getPlayerScore } from '@/lib/game/ScoringService'
import { QUESTIONS } from '@/lib/questions'

export async function POST(req: Request) {
  const token = getTeacherToken(req)
  if (!token || !(await verifyTeacherToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { eventId } = await req.json()
  const session = await getGameSession(eventId)
  if (!session) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const q = QUESTIONS[session.currentQuestionIndex]
  const histogram = await calculateHistogram(eventId, q.id)
  const correctnessByPlayer = await scoreQuestion(eventId, q.id, q.correct)

  // Broadcast public reveal event
  await pusherServer.trigger(CHANNELS.quiz(eventId), EVENTS.ANSWER_REVEALED, {
    histogram,
    correctOption: q.correct,
    explanation: q.explanation,
    questionId: q.id,
    correctnessByPlayer,
  })

  // Send personal score updates
  const participants = await getAllParticipants(eventId)
  for (const p of participants) {
    const correctCount = await getPlayerScore(eventId, p.participantId)
    const wasCorrect = correctnessByPlayer[p.participantId] ?? false
    const answeredCount = session.currentQuestionIndex + 1
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0

    await pusherServer.trigger(CHANNELS.player(p.participantId), EVENTS.SCORE_UPDATED, {
      correctCount,
      accuracy,
      wasCorrect,
      questionId: q.id,
    })
  }

  // Broadcast leaderboard
  const leaderboard = await getLeaderboard(eventId)
  await pusherServer.trigger(CHANNELS.quiz(eventId), EVENTS.LEADERBOARD_UPDATED, { leaderboard })

  session.phase = 'revealed'
  await updateGameSession(session)

  return NextResponse.json({ ok: true, histogram, correctOption: q.correct })
}
