import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.TEACHER_SECRET ?? 'fallback-secret')

export async function signTeacherToken(): Promise<string> {
  return new SignJWT({ role: 'teacher' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyTeacherToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export function getTeacherToken(req: Request): string | null {
  const authHeader = req.headers.get('x-teacher-token')
  return authHeader ?? null
}
