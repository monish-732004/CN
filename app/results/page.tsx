'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/hooks/useGameState'
import { CHARACTERS } from '@/lib/characters'
import { motion } from 'framer-motion'

export default function ResultsPage() {
  const router = useRouter()
  const { winner, leaderboard, correctCount } = useGameStore()
  const [nickname, setNickname] = useState('')
  const [participantId, setParticipantId] = useState('')

  useEffect(() => {
    const pid = sessionStorage.getItem('participantId') ?? ''
    const nick = sessionStorage.getItem('nickname') ?? ''
    setParticipantId(pid)
    setNickname(nick)
  }, [])

  const myRank = leaderboard.find(e => e.participantId === participantId)?.rank ?? 0

  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-8">
      {/* Winner announcement */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-3">🏆</div>
          <h1 className="font-orbitron text-3xl font-black text-[#FFD700] animate-gold-pulse">
            {winner.message}
          </h1>
          <p className="text-accent text-lg mt-2">{winner.prize} Cash Prize</p>
          <p className="text-text-muted text-xs mt-1">Prize awarded by event organizer</p>
        </motion.div>
      )}

      {/* My result */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-white/10 rounded-2xl p-5 w-full max-w-sm mb-6 text-center"
      >
        <div className="text-text-muted text-xs mb-1">YOUR RESULT</div>
        <div className="font-orbitron text-2xl font-black text-text-main">{nickname}</div>
        <div className="flex justify-center gap-6 mt-3">
          <div>
            <div className="font-mono text-2xl font-bold text-primary">{correctCount}</div>
            <div className="text-text-muted text-xs">Correct</div>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-secondary">#{myRank}</div>
            <div className="text-text-muted text-xs">Rank</div>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-accent">
              {correctCount > 0 ? Math.round((correctCount / 15) * 100) : 0}%
            </div>
            <div className="text-text-muted text-xs">Accuracy</div>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm"
      >
        <h2 className="font-orbitron text-sm text-text-muted mb-3">FINAL LEADERBOARD</h2>
        <div className="space-y-2">
          {leaderboard.slice(0, 10).map((entry, i) => {
            const char = CHARACTERS.find(c => c.id === entry.characterId)
            const isMe = entry.participantId === participantId
            return (
              <motion.div
                key={entry.participantId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 border ${isMe ? 'border-[#FFD700]/50 bg-[#FFD700]/10' : 'border-white/5 bg-card'}`}
              >
                <span className="font-mono text-text-muted w-5 text-center text-xs">
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                </span>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: char?.color ?? '#888' }}
                >
                  {entry.nickname[0]}
                </div>
                <span className="flex-1 text-text-main text-sm font-medium truncate">{entry.nickname}</span>
                <span className="font-mono text-primary text-sm">{entry.correctCount}</span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <button
        onClick={() => router.push('/')}
        className="mt-8 text-text-muted text-sm underline underline-offset-2 hover:text-primary transition-colors"
      >
        Back to Home
      </button>
    </main>
  )
}
