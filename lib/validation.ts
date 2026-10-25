import { z } from 'zod'

export const joinSchema = z.object({
  pin: z.string().length(6).regex(/^\d+$/),
  nickname: z.string().min(2).max(20).regex(/^[a-zA-Z0-9 ]+$/),
  characterId: z.string().min(1).max(50),
  sessionToken: z.string().optional(),
})

export const submitAnswerSchema = z.object({
  questionId: z.string(),
  option: z.enum(['A', 'B', 'C', 'D']),
  sessionToken: z.string(),
})

export const teacherAuthSchema = z.object({
  secret: z.string().min(1),
})
