import { redis, KEYS } from '../redis'
import { Histogram } from '../../types'

export async function calculateHistogram(eventId: string, questionId: string): Promise<Histogram> {
  const answers = await redis.hgetall<Record<string, string>>(KEYS.answers(eventId, questionId))

  const histogram: Histogram = { A: 0, B: 0, C: 0, D: 0, total: 0 }
  if (!answers) return histogram

  for (const option of Object.values(answers)) {
    const o = String(option) as 'A' | 'B' | 'C' | 'D'
    if (o in histogram) {
      histogram[o]++
      histogram.total++
    }
  }

  return histogram
}

export async function getPlayerAnswer(eventId: string, questionId: string, participantId: string): Promise<string | null> {
  const answer = await redis.hget<string>(KEYS.answers(eventId, questionId), participantId)
  return answer ? String(answer) : null
}
