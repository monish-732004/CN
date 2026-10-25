import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { redis, KEYS, TTL } from '@/lib/redis'
import { pusherServer, CHANNELS, EVENTS } from '@/lib/pusher'
import { joinSchema } from '@/lib/validation'
import { CHARACTERS } from '@/lib/characters'
import {
  getEventIdByPin,
  getGameSession,
  getAllParticipants,
  addParticipant,
  isCharacterTaken,
} from '@/lib/game/GameSession'
import { SessionData, ParticipantInfo } from '@/types'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = joinSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 })
  }

  const { pin, nickname, characterId, sessionToken } = parsed.data

  // Validate character exists
  const characterValid = CHARACTERS.some(c => c.id === characterId)
  if (!characterValid) {
    return NextResponse.json({ error: 'Invalid character' }, { status: 400 })
  }

  const eventId = await getEventIdByPin(pin)
  if (!eventId) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 404 })
  }

  const session = await getGameSession(eventId)
  if (!session) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  if (session.status === 'finished') {
    return NextResponse.json({ error: 'Event has ended' }, { status: 400 })
  }

  // Handle reconnection
  if (sessionToken) {
    const existingSession = await redis.get<SessionData>(KEYS.session(sessionToken))
    if (existingSession && (existingSession as any).eventId === eventId) {
      const sd = existingSession as unknown as SessionData
      return NextResponse.json({
        participantId: sd.participantId,
        sessionToken,
        currentState: session,
        reconnected: true,
      })
    }
  }

  // Check if character is taken
  const taken = await isCharacterTaken(eventId, characterId)
  if (taken) {
    return NextResponse.json({ error: 'character_taken' }, { status: 409 })
  }

  // Check nickname uniqueness
  const participants = await getAllParticipants(eventId)
  const nicknameTaken = participants.some(p => p.nickname.toLowerCase() === nickname.toLowerCase())
  if (nicknameTaken) {
    return NextResponse.json({ error: 'Nickname already taken' }, { status: 409 })
  }

  const participantId = nanoid(12)
  const newToken = nanoid(32)

  const participant: ParticipantInfo = {
    participantId,
    nickname,
    characterId,
    joinedAt: Date.now(),
    eventId,
  }

  const sessionData: SessionData = {
    eventId,
    participantId,
    nickname,
    characterId,
  }

  await addParticipant(eventId, participant)
  await redis.set(KEYS.session(newToken), JSON.stringify(sessionData), { ex: TTL })

  // Broadcast lobby update
  const allParticipants = await getAllParticipants(eventId)
  await pusherServer.trigger(CHANNELS.quiz(eventId), EVENTS.LOBBY_UPDATED, {
    participants: allParticipants.map(p => ({
      participantId: p.participantId,
      nickname: p.nickname,
      characterId: p.characterId,
    })),
  })

  return NextResponse.json({
    participantId,
    sessionToken: newToken,
    currentState: session,
  })
}
