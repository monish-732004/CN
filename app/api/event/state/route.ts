import { NextResponse } from 'next/server'
import { redis, KEYS } from '@/lib/redis'
import { getGameSession, getLeaderboard } from '@/lib/game/GameSession'
import { SessionData } from '@/types'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionToken = searchParams.get('sessionToken')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Missing sessionToken' }, { status: 400 })
  }

  const sessionData = await redis.get<SessionData>(KEYS.session(sessionToken))
  if (!sessionData) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const sd = typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData as SessionData
  const gameSession = await getGameSession(sd.eventId)
  if (!gameSession) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  const leaderboard = await getLeaderboard(sd.eventId)
  const myEntry = leaderboard.find(e => e.participantId === sd.participantId)

  return NextResponse.json({
    gameSession,
    participantId: sd.participantId,
    nickname: sd.nickname,
    characterId: sd.characterId,
    correctCount: myEntry?.correctCount ?? 0,
    leaderboard,
  })
}
