import { NextResponse } from 'next/server'
import { pusherServer, CHANNELS, EVENTS } from '@/lib/pusher'
import { verifyTeacherToken, getTeacherToken } from '@/lib/teacher-auth'
import { getGameSession, updateGameSession } from '@/lib/game/GameSession'
import { QUESTIONS } from '@/lib/questions'

export async function POST(req: Request) {
  const token = getTeacherToken(req)
  if (!token || !(await verifyTeacherToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { eventId } = await req.json()
  const session = await getGameSession(eventId)
  if (!session) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  if (session.phase !== 'question_active') {
    return NextResponse.json({ error: 'Question not active' }, { status: 400 })
  }

  session.phase = 'question_closed'
  session.currentQuestionDeadline = Date.now()
  await updateGameSession(session)

  const q = QUESTIONS[session.currentQuestionIndex]
  await pusherServer.trigger(CHANNELS.quiz(eventId), EVENTS.QUESTION_CLOSED, {
    questionId: q.id,
  })

  return NextResponse.json({ ok: true })
}
