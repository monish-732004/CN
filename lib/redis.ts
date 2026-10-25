import { Redis } from '@upstash/redis'

let _redis: Redis | null = null

export function getRedis(): Redis {
  if (!_redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token || url === 'your_redis_url') {
      throw new Error('Redis is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local')
    }
    _redis = new Redis({ url, token })
  }
  return _redis
}

// Proxy object so existing code can use `redis.get()` etc. without changes
export const redis = new Proxy({} as Redis, {
  get(_target, prop) {
    return getRedis()[prop as keyof Redis]
  },
})

export const TTL = 60 * 60 * 24 // 24 hours

export const KEYS = {
  eventPin: (pin: string) => `event:pin:${pin}`,
  event: (eventId: string) => `event:${eventId}`,
  answers: (eventId: string, qId: string) => `answers:${eventId}:${qId}`,
  answerTimes: (eventId: string, qId: string) => `answer_times:${eventId}:${qId}`,
  scores: (eventId: string) => `scores:${eventId}`,
  participants: (eventId: string) => `participants:${eventId}`,
  session: (token: string) => `sessions:${token}`,
}
