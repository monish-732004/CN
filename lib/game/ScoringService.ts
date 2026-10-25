import { redis, KEYS, TTL } from '../redis'
import { getAllParticipants } from './GameSession'
import { getPlayerAnswer } from './HistogramService'

export async function scoreQuestion(
  eventId: string,
  questionId: string,
  correctAnswer: string,
): Promise<Record<string, boolean>> {
  const participants = await getAllParticipants(eventId)
  const results: Record<string, boolean> = {}

  for (const p of participants) {
    const answer = await getPlayerAnswer(eventId, questionId, p.participantId)
    const isCorrect = answer === correctAnswer
    results[p.participantId] = isCorrect

    if (isCorrect) {
      await redis.hincrby(KEYS.scores(eventId), p.participantId, 1)
    }
  }

  await redis.expire(KEYS.scores(eventId), TTL)
  return results
}

export async function getPlayerScore(eventId: string, participantId: string): Promise<number> {
  const score = await redis.hget<string>(KEYS.scores(eventId), participantId)
  return score ? parseInt(String(score), 10) : 0
}

export async function getAllScores(eventId: string): Promise<Record<string, number>> {
  const raw = await redis.hgetall<Record<string, string>>(KEYS.scores(eventId))
  if (!raw) return {}
  const result: Record<string, number> = {}
  for (const [k, v] of Object.entries(raw)) {
    result[k] = parseInt(String(v), 10) || 0
  }
  return result
}
