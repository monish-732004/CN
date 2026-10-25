'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { useGameStore } from '@/hooks/useGameState'
import { useTimer } from '@/hooks/useTimer'
import { CHARACTERS } from '@/lib/characters'
import { QUESTIONS } from '@/lib/questions'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { QRCodeSVG } from 'qrcode.react'

const OPTION_COLORS = { A: '#E53E3E', B: '#3182CE', C: '#38A169', D: '#D69E2E' }

export default function TeacherPage() {
  const [secret, setSecret] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [eventId, setEventId] = useState<string | null>(null)
  const [pin, setPin] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const {
    participants, currentQuestion, phase, histogram, correctOption, explanation,
    questionNumber, leaderboard, winner, deadline, isPaused,
  } = useGameStore()

  useSocket(eventId, null)

  const timeLeft = useTimer(phase === 'question_active' && !isPaused ? deadline : 0)

  // Auto-close question when timer expires
  const handleAutoClose = useCallback(async () => {
    if (!token || !eventId || phase !== 'question_active') return
    await fetch('/api/teacher/close-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-teacher-token': token },
      body: JSON.stringify({ eventId }),
    })
  }, [token, eventId, phase])

  const timeLeftForAutoClose = useTimer(phase === 'question_active' && !isPaused ? deadline : 0, handleAutoClose)

  const teacherAction = async (endpoint: string, extra: Record<string, unknown> = {}) => {
    if (!token || !eventId) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/teacher/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-teacher-token': token },
        body: JSON.stringify({ eventId, ...extra }),
      })
      const data = await res.json()
      if (!res.ok) toast.error(data.error || 'Error')
      else toast.success(`Done: ${endpoint}`)
    } catch {
      toast.error('Network error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleAuth = async () => {
    setAuthLoading(true)
    try {
      const res = await fetch('/api/teacher/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error('Wrong password'); return }
      setToken(data.token)
      toast.success('Authenticated!')
    } catch {
      toast.error('Connection error')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleCreateEvent = async () => {
    if (!token) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/event/create', {
        method: 'POST',
        headers: { 'x-teacher-token': token },
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Error'); return }
      setEventId(data.eventId)
      setPin(data.pin)
      // Seed game store with event
      useGameStore.getState().setSession({ eventId: data.eventId })
      toast.success(`Event created! PIN: ${data.pin}`)
    } catch {
      toast.error('Failed to create event')
    } finally {
      setActionLoading(false)
    }
  }

  const joinUrl = pin ? `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/join/${pin}` : ''

  // AUTH SCREEN
  if (!token) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="font-orbitron text-2xl font-black text-center text-text-main mb-6">Teacher Login</h1>
          <div className="bg-card border border-white/10 rounded-2xl p-6">
            <label className="text-text-muted text-xs block mb-2">TEACHER PASSWORD</label>
            <input
              type="password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAuth()}
              placeholder="Enter teacher secret"
              className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-text-main outline-none focus:border-primary mb-4"
            />
            <button
              onClick={handleAuth}
              disabled={authLoading || !secret}
              className="w-full bg-gradient-to-r from-primary to-secondary text-bg font-orbitron font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
            >
              {authLoading ? 'Checking...' : 'ACCESS CONTROL PANEL'}
            </button>
          </div>
        </div>
      </main>
    )
  }

  // EVENT CREATION
  if (!eventId) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-orbitron text-2xl font-black text-text-main mb-2">Control Panel</h1>
          <p className="text-text-muted text-sm mb-6">Create a new quiz event for your classroom</p>
          <button
            onClick={handleCreateEvent}
            disabled={actionLoading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-bg font-orbitron font-bold py-4 rounded-xl text-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
          >
            {actionLoading ? 'Creating...' : 'CREATE NEW EVENT'}
          </button>
        </div>
      </main>
    )
  }

  // MAIN CONTROL PANEL
  return (
    <main className="min-h-screen bg-bg p-4">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-orbitron text-xl font-black text-text-main">NeuralQuiz Control</h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-primary text-sm">PIN: <strong>{pin}</strong></span>
            <span className="text-text-muted text-xs">{participants.length} players</span>
            {isPaused && <span className="text-accent text-xs font-mono animate-pulse">PAUSED</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Game controls */}
          <div className="lg:col-span-2 space-y-4">
            {/* QR Code + PIN */}
            {phase === 'lobby' || !currentQuestion ? (
              <div className="bg-card border border-white/10 rounded-2xl p-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-white p-2 rounded-lg">
                    <QRCodeSVG value={joinUrl} size={80} />
                  </div>
                  <div>
                    <div className="font-orbitron text-3xl font-black text-[#FFD700]">{pin}</div>
                    <div className="text-text-muted text-xs mt-1 break-all max-w-xs">{joinUrl}</div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Active question view */}
            {currentQuestion && (
              <div className="bg-card border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-orbitron text-sm text-text-muted">Q{questionNumber} / 15</span>
                  {phase === 'question_active' && (
                    <span className={`font-mono text-2xl font-bold ${timeLeft <= 5 ? 'text-error' : 'text-primary'}`}>
                      {timeLeft}s
                    </span>
                  )}
                </div>
                <p className="text-text-main font-medium mb-4">{currentQuestion.text}</p>

                {/* Options */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {(['A', 'B', 'C', 'D'] as const).map(opt => {
                    const isCorrect = phase === 'revealed' && correctOption === opt
                    const count = histogram?.[opt] ?? 0
                    const total = histogram?.total ?? 0
                    return (
                      <div
                        key={opt}
                        className={`rounded-lg p-2 border text-xs ${isCorrect ? 'border-success bg-success/10' : 'border-white/10'}`}
                      >
                        <span
                          className="inline-block w-5 h-5 rounded text-white text-xs font-bold mr-1 text-center leading-5"
                          style={{ background: OPTION_COLORS[opt] }}
                        >
                          {opt}
                        </span>
                        <span className="text-text-main">{currentQuestion.options[opt]}</span>
                        {phase === 'revealed' && histogram && (
                          <div className="mt-1">
                            <motion.div
                              className="h-1 rounded-full"
                              style={{ background: isCorrect ? '#66BB6A' : OPTION_COLORS[opt] + '88' }}
                              initial={{ width: 0 }}
                              animate={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                              transition={{ duration: 0.8 }}
                            />
                            <span className="text-text-muted" style={{ fontSize: '10px' }}>
                              {count} votes ({total > 0 ? Math.round((count / total) * 100) : 0}%)
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {phase === 'revealed' && explanation && (
                  <div className="bg-success/10 border border-success/30 rounded-lg p-3 text-sm text-success">
                    <strong>Answer: {correctOption}</strong> — {explanation}
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="bg-card border border-white/10 rounded-2xl p-4">
              <h3 className="font-orbitron text-xs text-text-muted mb-3">GAME CONTROLS</h3>
              <div className="flex flex-wrap gap-2">
                {/* Start */}
                {phase === 'lobby' && (
                  <button
                    onClick={() => teacherAction('start')}
                    disabled={actionLoading || participants.length === 0}
                    className="flex-1 bg-success text-white font-bold py-3 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
                  >
                    START QUIZ
                  </button>
                )}

                {/* Close Question */}
                {phase === 'question_active' && (
                  <button
                    onClick={() => teacherAction('close-question')}
                    disabled={actionLoading}
                    className="flex-1 bg-accent text-bg font-bold py-3 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
                  >
                    CLOSE EARLY
                  </button>
                )}

                {/* Reveal */}
                {phase === 'question_closed' && (
                  <button
                    onClick={() => teacherAction('reveal')}
                    disabled={actionLoading}
                    className="flex-1 bg-primary text-bg font-bold py-3 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
                  >
                    REVEAL ANSWER
                  </button>
                )}

                {/* Next */}
                {phase === 'revealed' && (
                  <button
                    onClick={() => teacherAction('next')}
                    disabled={actionLoading}
                    className="flex-1 bg-secondary text-bg font-bold py-3 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
                  >
                    NEXT QUESTION →
                  </button>
                )}

                {/* Pause/Resume */}
                {(phase === 'question_active' || isPaused) && (
                  <button
                    onClick={() => teacherAction('pause')}
                    disabled={actionLoading}
                    className={`px-4 py-3 rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all ${isPaused ? 'bg-success text-white' : 'bg-surface text-text-muted border border-white/10'}`}
                  >
                    {isPaused ? 'RESUME' : 'PAUSE'}
                  </button>
                )}

                {/* End game */}
                {phase !== 'lobby' && phase !== 'finished' && (
                  <button
                    onClick={() => {
                      if (confirm('End the game early?')) teacherAction('end')
                    }}
                    disabled={actionLoading}
                    className="px-4 py-3 rounded-xl text-sm font-bold bg-error/20 text-error border border-error/30 hover:opacity-90 active:scale-95 transition-all"
                  >
                    END GAME
                  </button>
                )}
              </div>
            </div>

            {/* Winner display */}
            {winner && phase === 'finished' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#FFD700]/10 border border-[#FFD700]/50 rounded-2xl p-4 text-center"
              >
                <div className="text-3xl mb-2">🏆</div>
                <h2 className="font-orbitron text-xl font-black text-[#FFD700]">{winner.message}</h2>
                <p className="text-accent mt-1">{winner.prize} Cash Prize</p>
              </motion.div>
            )}
          </div>

          {/* Right: Participants + Leaderboard */}
          <div className="space-y-4">
            {/* Participants */}
            <div className="bg-card border border-white/10 rounded-2xl p-4">
              <h3 className="font-orbitron text-xs text-text-muted mb-3">
                PARTICIPANTS ({participants.length})
              </h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {participants.map(p => {
                  const char = CHARACTERS.find(c => c.id === p.characterId)
                  return (
                    <div key={p.participantId} className="flex items-center gap-2 group">
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                        style={{ background: char?.color ?? '#888' }}
                      >
                        {p.nickname[0]}
                      </div>
                      <span className="flex-1 text-text-main text-xs truncate">{p.nickname}</span>
                      <span className="text-text-muted text-xs truncate">{char?.name}</span>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${p.nickname}?`)) {
                            fetch('/api/teacher/remove-player', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', 'x-teacher-token': token! },
                              body: JSON.stringify({ eventId, participantId: p.participantId }),
                            })
                          }
                        }}
                        className="text-error text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}
                {participants.length === 0 && (
                  <p className="text-text-muted text-xs">No players yet. Share the PIN!</p>
                )}
              </div>
            </div>

            {/* Leaderboard */}
            {leaderboard.length > 0 && (
              <div className="bg-card border border-white/10 rounded-2xl p-4">
                <h3 className="font-orbitron text-xs text-text-muted mb-3">LEADERBOARD</h3>
                <div className="space-y-1">
                  {leaderboard.slice(0, 8).map(entry => {
                    const char = CHARACTERS.find(c => c.id === entry.characterId)
                    return (
                      <div key={entry.participantId} className="flex items-center gap-2 text-xs">
                        <span className="text-text-muted w-4 font-mono">{entry.rank}</span>
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ background: char?.color ?? '#888' }}
                        />
                        <span className="flex-1 text-text-main truncate">{entry.nickname}</span>
                        <span className="font-mono text-primary">{entry.correctCount}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Stage link */}
            <div className="bg-card border border-white/10 rounded-2xl p-4">
              <h3 className="font-orbitron text-xs text-text-muted mb-2">PROJECTOR VIEW</h3>
              <a
                href={`/stage?eventId=${eventId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-surface border border-primary/30 text-primary text-sm font-medium py-2 rounded-lg hover:bg-primary/10 transition-colors"
              >
                Open Stage View →
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
