import { NextResponse } from 'next/server'
import { pusherServer, CHANNELS, EVENTS } from '@/lib/pusher'
import { verifyTeacherToken, getTeacherToken } from '@/lib/teacher-auth'
import { getGameSession, updateGameSession } from '@/lib/game/GameSession'
import { QUESTIONS, toPublicQuestion } from '@/lib/questions'

export async function POST(req: Request) {
  const token = getTeacherToken(req)
  if (!token || !(await verifyTeacherToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { eventId } = await req.json()
  const session = await getGameSession(eventId)
  if (!session) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  if (session.status !== 'lobby') {
    return NextResponse.json({ error: 'Game already started' }, { status: 400 })
  }

  const q = QUESTIONS[0]
  const deadline = Date.now() + q.timeLimit * 1000

  session.status = 'active'
  session.currentQuestionIndex = 0
  session.phase = 'question_active'
  session.currentQuestionDeadline = deadline
  session.startedAt = Date.now()

  await updateGameSession(session)

  await pusherServer.trigger(CHANNELS.quiz(eventId), EVENTS.GAME_STARTED, {
    questionNumber: 1,
    totalQuestions: QUESTIONS.length,
  })

  await pusherServer.trigger(CHANNELS.quiz(eventId), EVENTS.QUESTION_STARTED, {
    question: toPublicQuestion(q),
    deadline,
    questionNumber: 1,
  })

  return NextResponse.json({ ok: true })
}
