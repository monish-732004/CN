import { NextResponse } from 'next/server'
import { pusherServer, CHANNELS, EVENTS } from '@/lib/pusher'
import { verifyTeacherToken, getTeacherToken } from '@/lib/teacher-auth'
import { getGameSession, updateGameSession, getLeaderboard } from '@/lib/game/GameSession'
import { determineWinner } from '@/lib/game/WinnerService'
import { QUESTIONS, toPublicQuestion } from '@/lib/questions'

export async function POST(req: Request) {
  const token = getTeacherToken(req)
  if (!token || !(await verifyTeacherToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { eventId } = await req.json()
  const session = await getGameSession(eventId)
  if (!session) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const nextIndex = session.currentQuestionIndex + 1

  if (nextIndex >= QUESTIONS.length) {
    // End game
    const leaderboard = await getLeaderboard(eventId)
    const winner = await determineWinner(eventId, leaderboard)

    session.status = 'finished'
    session.phase = 'revealed'
    session.finishedAt = Date.now()
    await updateGameSession(session)

    await pusherServer.trigger(CHANNELS.quiz(eventId), EVENTS.GAME_FINISHED, {
      winner,
      finalLeaderboard: leaderboard,
    })

    return NextResponse.json({ ok: true, finished: true })
  }

  const q = QUESTIONS[nextIndex]
  const deadline = Date.now() + q.timeLimit * 1000

  session.currentQuestionIndex = nextIndex
  session.phase = 'question_active'
  session.currentQuestionDeadline = deadline
  await updateGameSession(session)

  await pusherServer.trigger(CHANNELS.quiz(eventId), EVENTS.QUESTION_STARTED, {
    question: toPublicQuestion(q),
    deadline,
    questionNumber: nextIndex + 1,
  })

  return NextResponse.json({ ok: true, questionNumber: nextIndex + 1 })
}
