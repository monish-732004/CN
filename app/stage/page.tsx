'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSocket } from '@/hooks/useSocket'
import { useGameStore } from '@/hooks/useGameState'
import { useTimer } from '@/hooks/useTimer'
import { CHARACTERS } from '@/lib/characters'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import dynamic from 'next/dynamic'

const Arena = dynamic(() => import('@/components/3d/Arena'), { ssr: false, loading: () => <div className="w-full h-full bg-surface" /> })

const OPTION_COLORS = { A: '#E53E3E', B: '#3182CE', C: '#38A169', D: '#D69E2E' }

function StageContent() {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')
  const [pin, setPin] = useState('')

  const {
    participants, currentQuestion, phase, histogram, correctOption, explanation,
    questionNumber, leaderboard, winner, deadline, isPaused,
  } = useGameStore()

  useSocket(eventId, null)

  const timeLeft = useTimer(phase === 'question_active' && !isPaused ? deadline : 0)

  useEffect(() => {
    if (!eventId) return
    fetch(`/api/event/state?sessionToken=NONE`)
      .catch(() => {})
  }, [eventId])

  // Get PIN from event state
  useEffect(() => {
    const storedPin = sessionStorage.getItem('stagePin')
    if (storedPin) setPin(storedPin)
  }, [])

  const appUrl = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <main className="w-screen h-screen bg-bg overflow-hidden flex flex-col" style={{ fontFamily: 'var(--font-orbitron)' }}>
      {/* Lobby view */}
      {(phase === 'lobby' || !currentQuestion) && phase !== 'finished' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="font-orbitron text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-4">
            NeuralQuiz
          </h1>
          <p className="text-text-muted text-lg mb-8">Anime · Computer Networks · ₹100 Prize</p>

          {eventId && (
            <div className="flex gap-8 items-center mb-8">
              <div className="bg-white p-3 rounded-xl">
                <QRCodeSVG value={`${appUrl}/join/${pin || eventId}`} size={120} />
              </div>
              <div>
                <div className="text-text-muted text-sm mb-1">JOIN WITH PIN</div>
                <div className="font-orbitron text-6xl font-black text-[#FFD700]">{pin || '------'}</div>
                <div className="text-text-muted text-sm mt-1">{appUrl}/join/{pin || '------'}</div>
              </div>
            </div>
          )}

          {/* Character parade */}
          <div className="flex flex-wrap gap-3 justify-center max-w-3xl px-4">
            {participants.map(p => {
              const char = CHARACTERS.find(c => c.id === p.characterId)
              return (
                <motion.div
                  key={p.participantId}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: char?.color ?? '#888' }}
                  >
                    {p.nickname[0]}
                  </div>
                  <span className="text-text-main text-xs">{p.nickname}</span>
                </motion.div>
              )
            })}
          </div>
          <p className="text-text-muted mt-6 text-sm">{participants.length} player{participants.length !== 1 ? 's' : ''} ready</p>
        </div>
      )}

      {/* Active question view */}
      {currentQuestion && phase !== 'finished' && (
        <div className="flex-1 flex flex-col p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="font-orbitron text-sm text-text-muted">Q{questionNumber} / 15</div>
            <div className="flex items-center gap-3">
              {isPaused && <span className="text-accent text-lg font-mono animate-pulse">⏸ PAUSED</span>}
              {phase === 'question_active' && !isPaused && (
                <div className={`font-mono text-4xl font-black w-16 h-16 rounded-full border-4 flex items-center justify-center ${timeLeft <= 5 ? 'text-error border-error' : 'text-primary border-primary'}`}>
                  {timeLeft}
                </div>
              )}
            </div>
          </div>

          {/* Question text */}
          <div className="bg-card border border-white/10 rounded-2xl p-6 mb-6">
            <p className="text-text-main text-2xl font-medium leading-snug">{currentQuestion.text}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            {(['A', 'B', 'C', 'D'] as const).map((opt, i) => {
              const isCorrect = phase === 'revealed' && correctOption === opt
              const count = histogram?.[opt] ?? 0
              const total = histogram?.total ?? 0
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <motion.div
                  key={opt}
                  className={`relative rounded-2xl p-5 border-2 overflow-hidden ${isCorrect ? 'border-success' : 'border-white/10'}`}
                  style={{ background: OPTION_COLORS[opt] + '22' }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="inline-block w-8 h-8 rounded-lg text-white text-sm font-black text-center leading-8 flex-shrink-0"
                      style={{ background: OPTION_COLORS[opt] }}
                    >
                      {opt}
                    </span>
                    <span className="text-text-main text-lg font-medium">{currentQuestion.options[opt]}</span>
                  </div>

                  {/* Histogram */}
                  {phase === 'revealed' && histogram && (
                    <div className="mt-3">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ background: isCorrect ? '#66BB6A' : OPTION_COLORS[opt] + 'BB' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.15 }}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-text-muted text-sm">{count} votes</span>
                        <span className="text-text-muted text-sm font-mono">{pct}%</span>
                      </div>
                    </div>
                  )}

                  {isCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 text-success text-xl"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Explanation */}
          {phase === 'revealed' && explanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-success/10 border border-success/30 rounded-xl p-4"
            >
              <span className="text-success font-bold">Answer: {correctOption} — </span>
              <span className="text-text-muted">{explanation}</span>
            </motion.div>
          )}
        </div>
      )}

      {/* Winner celebration */}
      {phase === 'finished' && winner && (
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="text-center z-10"
          >
            <div className="text-8xl mb-4">🏆</div>
            <h1 className="font-orbitron text-5xl font-black text-[#FFD700] mb-2">{winner.message}</h1>
            <p className="text-accent text-2xl">{winner.prize} Cash Prize</p>
            <p className="text-text-muted text-sm mt-2">Prize awarded by event organizer</p>
          </motion.div>

          {/* Top 3 leaderboard */}
          <div className="flex gap-6 mt-8 z-10">
            {leaderboard.slice(0, 3).map((entry, i) => {
              const char = CHARACTERS.find(c => c.id === entry.characterId)
              return (
                <motion.div
                  key={entry.participantId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  className="text-center"
                >
                  <div className="text-3xl mb-1">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-1"
                    style={{ background: char?.color ?? '#888' }}
                  >
                    {entry.nickname[0]}
                  </div>
                  <div className="text-text-main font-semibold text-sm">{entry.nickname}</div>
                  <div className="font-mono text-primary">{entry.correctCount} correct</div>
                </motion.div>
              )
            })}
          </div>

          {/* Confetti particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#FFD700', '#4FC3F7', '#CE93D8', '#66BB6A', '#EF5350'][i % 5],
                left: `${Math.random() * 100}%`,
                top: '-10px',
              }}
              animate={{
                y: ['0vh', '110vh'],
                x: [0, (Math.random() - 0.5) * 200],
                rotate: [0, 360],
                opacity: [1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}
    </main>
  )
}

export default function StagePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center text-text-muted">Loading stage...</div>}>
      <StageContent />
    </Suspense>
  )
}
