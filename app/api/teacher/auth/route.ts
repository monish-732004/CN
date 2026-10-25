import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { signTeacherToken } from '@/lib/teacher-auth'
import { teacherAuthSchema } from '@/lib/validation'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = teacherAuthSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { secret } = parsed.data
  const expectedSecret = process.env.TEACHER_SECRET ?? ''

  let isValid = false
  try {
    const a = Buffer.from(secret.padEnd(64))
    const b = Buffer.from(expectedSecret.padEnd(64))
    if (a.length === b.length) {
      isValid = timingSafeEqual(a, b) && secret === expectedSecret
    }
  } catch {
    isValid = false
  }

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const token = await signTeacherToken()
  return NextResponse.json({ token })
}
