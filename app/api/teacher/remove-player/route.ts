import { NextResponse } from 'next/server'
import { pusherServer, CHANNELS, EVENTS } from '@/lib/pusher'
import { verifyTeacherToken, getTeacherToken } from '@/lib/teacher-auth'
import { getGameSession, getAllParticipants, removeParticipant } from '@/lib/game/GameSession'

export async function POST(req: Request) {
  const token = getTeacherToken(req)
  if (!token || !(await verifyTeacherToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { eventId, participantId } = await req.json()
  const session = await getGameSession(eventId)
  if (!session) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  await removeParticipant(eventId, participantId)

  await pusherServer.trigger(CHANNELS.player(participantId), EVENTS.PLAYER_REMOVED, {
    reason: 'Removed by teacher',
  })

  const participants = await getAllParticipants(eventId)
  await pusherServer.trigger(CHANNELS.quiz(eventId), EVENTS.LOBBY_UPDATED, {
    participants: participants.map(p => ({
      participantId: p.participantId,
      nickname: p.nickname,
      characterId: p.characterId,
    })),
  })

  return NextResponse.json({ ok: true })
}
