import { NextResponse } from 'next/server'
import { pusherServer, CHANNELS, EVENTS } from '@/lib/pusher'
import { verifyTeacherToken, getTeacherToken } from '@/lib/teacher-auth'
import { getGameSession, updateGameSession } from '@/lib/game/GameSession'

export async function POST(req: Request) {
  const token = getTeacherToken(req)
  if (!token || !(await verifyTeacherToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { eventId } = await req.json()
  const session = await getGameSession(eventId)
  if (!session) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  if (session.status === 'paused') {
    // Resume
    const remaining = (session.pausedAt ?? Date.now()) - Date.now()
    const newDeadline = Date.now() + Math.max(remaining, 5000)
    session.status = 'active'
    session.currentQuestionDeadline = newDeadline
    delete session.pausedAt
    await updateGameSession(session)
    await pusherServer.trigger(CHANNELS.quiz(eventId), EVENTS.GAME_RESUMED, { deadline: newDeadline })
  } else {
    // Pause
    session.status = 'paused'
    session.pausedAt = Date.now()
    await updateGameSession(session)
    await pusherServer.trigger(CHANNELS.quiz(eventId), EVENTS.GAME_PAUSED, {})
  }

  return NextResponse.json({ ok: true, status: session.status })
}
