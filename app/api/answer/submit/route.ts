import { NextResponse } from 'next/server'
import { redis, KEYS, TTL } from '@/lib/redis'
import { submitAnswerSchema } from '@/lib/validation'
import { getGameSession, getParticipant } from '@/lib/game/GameSession'
import { SessionData } from '@/types'
import { QUESTIONS } from '@/lib/questions'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = submitAnswerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { questionId, option, sessionToken } = parsed.data

  const sessionData = await redis.get<SessionData>(KEYS.session(sessionToken))
  if (!sessionData) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  const sd = typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData as SessionData
  const { eventId, participantId } = sd

  const session = await getGameSession(eventId)
  if (!session) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  if (session.phase !== 'question_active') {
    return NextResponse.json({ error: 'Question not active', accepted: false }, { status: 400 })
  }

  // Check deadline
  if (Date.now() > session.currentQuestionDeadline + 500) {
    return NextResponse.json({ error: 'Too late', accepted: false }, { status: 400 })
  }

  // Validate questionId matches current question
  const currentQ = QUESTIONS[session.currentQuestionIndex]
  if (currentQ.id !== questionId) {
    return NextResponse.json({ error: 'Wrong question', accepted: false }, { status: 400 })
  }

  // Check for duplicate answer
  const existing = await redis.hexists(KEYS.answers(eventId, questionId), participantId)
  if (existing) {
    const prevAnswer = await redis.hget<string>(KEYS.answers(eventId, questionId), participantId)
    return NextResponse.json({ accepted: false, alreadyAnswered: true, yourAnswer: prevAnswer })
  }

  // Lock the answer
  await redis.hset(KEYS.answers(eventId, questionId), { [participantId]: option })
  await redis.expire(KEYS.answers(eventId, questionId), TTL)

  // Store answer timestamp for tie-breaking
  await redis.hset(KEYS.answerTimes(eventId, questionId), { [participantId]: String(Date.now()) })
  await redis.expire(KEYS.answerTimes(eventId, questionId), TTL)

  return NextResponse.json({ accepted: true, yourAnswer: option })
}
