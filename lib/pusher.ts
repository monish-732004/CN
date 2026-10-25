import Pusher from 'pusher'

let _pusherServer: Pusher | null = null

export function getPusherServer(): Pusher {
  if (!_pusherServer) {
    _pusherServer = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    })
  }
  return _pusherServer
}

export const pusherServer = new Proxy({} as Pusher, {
  get(_target, prop) {
    return getPusherServer()[prop as keyof Pusher]
  },
})

export const CHANNELS = {
  quiz: (eventId: string) => `quiz-${eventId}`,
  player: (participantId: string) => `private-player-${participantId}`,
}

export const EVENTS = {
  LOBBY_UPDATED: 'lobby:updated',
  GAME_STARTED: 'game:started',
  QUESTION_STARTED: 'question:started',
  QUESTION_CLOSED: 'question:closed',
  ANSWER_REVEALED: 'answer:revealed',
  LEADERBOARD_UPDATED: 'leaderboard:updated',
  GAME_PAUSED: 'game:paused',
  GAME_RESUMED: 'game:resumed',
  GAME_FINISHED: 'game:finished',
  SCORE_UPDATED: 'score:updated',
  PLAYER_REMOVED: 'player:removed',
}
