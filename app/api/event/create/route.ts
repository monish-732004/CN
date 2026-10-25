import { NextResponse } from 'next/server'
import { createGameSession } from '@/lib/game/GameSession'
import { verifyTeacherToken, getTeacherToken } from '@/lib/teacher-auth'

export async function POST(req: Request) {
  const token = getTeacherToken(req)
  if (!token || !(await verifyTeacherToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const session = await createGameSession()
  const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL}/join/${session.pin}`

  return NextResponse.json({
    eventId: session.eventId,
    pin: session.pin,
    joinUrl,
  })
}
