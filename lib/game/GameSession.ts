import { nanoid } from 'nanoid'
import { redis, KEYS, TTL } from '../redis'
import { GameSession, ParticipantInfo, LeaderboardEntry } from '../../types'

export function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function createGameSession(): Promise<GameSession> {
  const eventId = nanoid(12)
  let pin = generatePin()

  // Ensure unique PIN
  let existing = await redis.get(KEYS.eventPin(pin))
  while (existing) {
    pin = generatePin()
    existing = await redis.get(KEYS.eventPin(pin))
  }

  const session: GameSession = {
    eventId,
    pin,
    status: 'lobby',
    currentQuestionIndex: 0,
    phase: 'waiting',
    currentQuestionDeadline: 0,
    createdAt: Date.now(),
    config: { defaultTimeLimit: 20, winnerRule: 'most_correct' },
  }

  await redis.set(KEYS.event(eventId), JSON.stringify(session), { ex: TTL })
  await redis.set(KEYS.eventPin(pin), eventId, { ex: TTL })

  return session
}

export async function getGameSession(eventId: string): Promise<GameSession | null> {
  const data = await redis.get<string>(KEYS.event(eventId))
  if (!data) return null
  return typeof data === 'string' ? JSON.parse(data) : data as GameSession
}

export async function updateGameSession(session: GameSession): Promise<void> {
  await redis.set(KEYS.event(session.eventId), JSON.stringify(session), { ex: TTL })
}

export async function getEventIdByPin(pin: string): Promise<string | null> {
  const eventId = await redis.get<string>(KEYS.eventPin(pin))
  return eventId ?? null
}

export async function getParticipant(eventId: string, participantId: string): Promise<ParticipantInfo | null> {
  const data = await redis.hget<string>(KEYS.participants(eventId), participantId)
  if (!data) return null
  return typeof data === 'string' ? JSON.parse(data) : data as ParticipantInfo
}

export async function getAllParticipants(eventId: string): Promise<ParticipantInfo[]> {
  const data = await redis.hgetall<Record<string, string>>(KEYS.participants(eventId))
  if (!data) return []
  return Object.values(data).map(v => typeof v === 'string' ? JSON.parse(v) : v as ParticipantInfo)
}

export async function addParticipant(eventId: string, participant: ParticipantInfo): Promise<void> {
  await redis.hset(KEYS.participants(eventId), { [participant.participantId]: JSON.stringify(participant) })
  await redis.expire(KEYS.participants(eventId), TTL)
}

export async function removeParticipant(eventId: string, participantId: string): Promise<void> {
  await redis.hdel(KEYS.participants(eventId), participantId)
}

export async function isCharacterTaken(eventId: string, characterId: string, excludeParticipantId?: string): Promise<boolean> {
  const participants = await getAllParticipants(eventId)
  return participants.some(p => p.characterId === characterId && p.participantId !== excludeParticipantId)
}

export async function getLeaderboard(eventId: string): Promise<LeaderboardEntry[]> {
  const [participants, scoresRaw] = await Promise.all([
    getAllParticipants(eventId),
    redis.hgetall<Record<string, string>>(KEYS.scores(eventId)),
  ])

  const scores: Record<string, number> = {}
  if (scoresRaw) {
    for (const [k, v] of Object.entries(scoresRaw)) {
      scores[k] = parseInt(String(v), 10) || 0
    }
  }

  const entries: LeaderboardEntry[] = participants.map(p => ({
    participantId: p.participantId,
    nickname: p.nickname,
    characterId: p.characterId,
    correctCount: scores[p.participantId] ?? 0,
    rank: 0,
  }))

  entries.sort((a, b) => b.correctCount - a.correctCount)
  entries.forEach((e, i) => { e.rank = i + 1 })

  return entries
}
