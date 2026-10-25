import { NextResponse } from 'next/server'
import { pusherServer } from '@/lib/pusher'

export async function POST(req: Request) {
  const body = await req.text()
  const params = new URLSearchParams(body)
  const socketId = params.get('socket_id') ?? ''
  const channelName = params.get('channel_name') ?? ''

  // Validate private channel pattern
  if (!channelName.startsWith('private-player-')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const auth = pusherServer.authorizeChannel(socketId, channelName)
  return NextResponse.json(auth)
}
