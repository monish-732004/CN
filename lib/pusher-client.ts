import PusherJs from 'pusher-js'

let pusherInstance: PusherJs | null = null

export function getPusherClient(): PusherJs {
  if (!pusherInstance) {
    pusherInstance = new PusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
    })
  }
  return pusherInstance
}

export function disconnectPusher() {
  if (pusherInstance) {
    pusherInstance.disconnect()
    pusherInstance = null
  }
}
