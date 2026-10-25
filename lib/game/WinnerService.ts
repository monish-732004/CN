import { redis, KEYS } from '../redis'
import { WinnerData, LeaderboardEntry } from '../../types'

export async function determineWinner(eventId: string, leaderboard: LeaderboardEntry[]): Promise<WinnerData> {
  const topScore = leaderboard[0]?.correctCount ?? 0
  const topPlayers = leaderboard.filter(e => e.correctCount === topScore)

  // Tie-break by average answer speed
  if (topPlayers.length > 1) {
    const speeds: Record<string, number> = {}
    for (const p of topPlayers) {
      const times: number[] = []
      // Collect answer timestamps across all questions
      for (let i = 1; i <= 15; i++) {
        const t = await redis.hget<string>(KEYS.answerTimes(eventId, `q${String(i).padStart(2, '0')}`), p.participantId)
        if (t) times.push(parseInt(String(t), 10))
      }
      speeds[p.participantId] = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : Infinity
    }

    topPlayers.sort((a, b) => (speeds[a.participantId] ?? Infinity) - (speeds[b.participantId] ?? Infinity))
    const fastestTime = speeds[topPlayers[0].participantId]
    const ultimateWinners = topPlayers.filter(p => Math.abs((speeds[p.participantId] ?? 0) - fastestTime) < 100)

    if (ultimateWinners.length === 1) {
      return {
        participants: ultimateWinners,
        isSharedWin: false,
        prize: '₹100',
        message: `${ultimateWinners[0].nickname} wins ₹100!`,
      }
    }

    return {
      participants: ultimateWinners,
      isSharedWin: true,
      prize: '₹100',
      message: `${ultimateWinners.map(w => w.nickname).join(' & ')} share the win!`,
    }
  }

  const winner = topPlayers[0]
  return {
    participants: [winner],
    isSharedWin: false,
    prize: '₹100',
    message: winner ? `${winner.nickname} wins ₹100!` : 'No winner',
  }
}
