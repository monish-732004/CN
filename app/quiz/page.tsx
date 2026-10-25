'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useSocket } from '@/hooks/useSocket'
import { useGameStore } from '@/hooks/useGameState'
import { useTimer } from '@/hooks/useTimer'
import { CHARACTERS } from '@/lib/characters'
import { motion, AnimatePresence } from 'framer-motion'

const OPTION_COLORS = {
  A: { bg: '#E53E3E', hover: '#C53030', label: 'A' },
  B: { bg: '#3182CE', hover: '#2B6CB0', label: 'B' },
  C: { bg: '#38A169', hover: '#2F855A', label: 'C' },
  D: { bg: '#D69E2E', hover: '#B7791F', label: 'D' },
}

export default function QuizPage() {
  const router = useRouter()
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [participantId, setParticipantId] = useState<string | null>(null)
  const [eventId, setEventId] = useState<string | null>(null)
  const [nickname, setNickname] = useState('')
  const [characterId, setCharacterId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const teacherAutoCloseRef = useRef(false)

  const {
    currentQuestion, deadline, myAnswer, histogram, correctOption, explanation,
    questionNumber, correctCount, phase, winner, leaderboard, participants,
    isPaused, correctnessByPlayer, setAnswer,
  } = useGameStore()

  useEffect(() => {
    const token = sessionStorage.getItem('sessionToken')
    const pid = sessionStorage.getItem('participantId')
    const eid = sessionStorage.getItem('eventId')
    const nick = sessionStorage.getItem('nickname') ?? ''
    const cid = sessionStorage.getItem('characterId') ?? ''

    if (!token || !pid || !eid) { router.replace('/'); return }
    setSessionToken(token); setParticipantId(pid); setEventId(eid)
    setNickname(nick); setCharacterId(cid)
  }, [router])

  useSocket(eventId, participantId)

  const timeLeft = useTimer(phase === 'question_active' && !isPaused ? deadline : 0)

  useEffect(() => {
    if (phase === 'finished') { router.push('/results') }
  }, [phase, router])

  const handleAnswer = async (option: 'A' | 'B' | 'C' | 'D') => {
    if (myAnswer || phase !== 'question_active' || !currentQuestion || submitting) return
    setSubmitting(true)
    useGameStore.getState().setAnswer(option)

    try {
      const res = await fetch('/api/answer/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: currentQuestion.id, option, sessionToken }),
      })
      const data = await res.json()

      if (!res.ok || !data.accepted) {
        if (data.error === 'Too late') { toast.error('Too late!') }
        else if (data.alreadyAnswered) { toast.error('Already answered') }
        else { toast.error(data.error || 'Failed') }
        useGameStore.getState().setAnswer('')
      }
    } catch {
      toast.error('Connection error')
      useGameStore.getState().setAnswer('')
    } finally {
      setSubmitting(false)
    }
  }

  const myChar = CHARACTERS.find(c => c.id === characterId)
  const wasCorrect = correctnessByPlayer[participantId ?? '']

  if (!currentQuestion && phase === 'lobby') {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted">Waiting for game to start...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg flex flex-col px-3 py-4 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: myChar?.color ?? '#888' }}
          >
            {nickname[0] ?? '?'}
          </div>
          <div>
            <div className="text-text-main text-sm font-semibold">{nickname}</div>
            <div className="text-text-muted text-xs font-mono">{correctCount} correct</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isPaused && <span className="text-accent text-xs font-mono animate-pulse">PAUSED</span>}
          <div className="text-text-muted text-xs">Q{questionNumber}/15</div>
          {phase === 'question_active' && !isPaused && (
            <div
              className={`font-mono text-xl font-bold w-10 h-10 rounded-full flex items-center justify-center border-2 ${timeLeft <= 5 ? 'text-error border-error animate-pulse' : 'text-primary border-primary'}`}
            >
              {timeLeft}
            </div>
          )}
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="bg-card border border-white/10 rounded-2xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${currentQuestion.difficulty === 'easy' ? 'bg-success/20 text-success' : currentQuestion.difficulty === 'medium' ? 'bg-accent/20 text-accent' : 'bg-error/20 text-error'}`}>
                  {currentQuestion.difficulty.toUpperCase()}
                </span>
                <span className="text-text-muted text-xs">{currentQuestion.timeLimit}s</span>
              </div>
              <p className="text-text-main text-base font-medium leading-snug">{currentQuestion.text}</p>
            </div>

            {/* Answer buttons */}
            <div className="grid grid-cols-1 gap-3">
              {(['A', 'B', 'C', 'D'] as const).map(opt => {
                const col = OPTION_COLORS[opt]
                const isSelected = myAnswer === opt
                const isCorrect = phase === 'revealed' && correctOption === opt
                const isWrong = phase === 'revealed' && myAnswer === opt && correctOption !== opt

                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!myAnswer || phase !== 'question_active'}
                    className={`relative w-full text-left rounded-xl p-3 min-h-[56px] border-2 transition-all font-medium text-sm active:scale-95
                      ${isCorrect ? 'border-[#66BB6A] bg-[#66BB6A]/20 text-[#66BB6A]' :
                        isWrong ? 'border-error bg-error/10 text-error' :
                        isSelected ? 'border-white bg-white/10 text-white' :
                        phase !== 'question_active' ? 'border-white/10 text-text-muted opacity-60' :
                        'border-white/20 hover:border-white/40 text-text-main'
                      }
                    `}
                  >
                    <span
                      className="inline-block w-6 h-6 rounded text-white text-xs font-bold mr-2 text-center leading-6 flex-shrink-0"
                      style={{ background: col.bg }}
                    >
                      {opt}
                    </span>
                    {currentQuestion.options[opt]}
                    {/* Histogram bar overlay */}
                    {phase === 'revealed' && histogram && histogram.total > 0 && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 rounded-b-xl"
                        style={{ background: isCorrect ? '#66BB6A' : col.bg + '88' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(histogram[opt] / histogram.total) * 100}%` }}
                        transition={{ duration: 0.8, delay: (['A', 'B', 'C', 'D'].indexOf(opt)) * 0.15 }}
                      />
                    )}
                    {phase === 'revealed' && histogram && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted">
                        {histogram[opt]} ({histogram.total > 0 ? Math.round((histogram[opt] / histogram.total) * 100) : 0}%)
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Result feedback */}
            {phase === 'revealed' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 rounded-xl p-3 border ${wasCorrect ? 'bg-success/10 border-success/30' : 'bg-error/10 border-error/30'}`}
              >
                <div className={`font-bold text-sm mb-1 ${wasCorrect ? 'text-success' : 'text-error'}`}>
                  {wasCorrect ? '✓ Correct!' : myAnswer ? '✗ Wrong' : 'No answer submitted'}
                </div>
                <p className="text-text-muted text-xs">{explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {!currentQuestion && phase === 'revealed' && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-muted text-sm">Loading next question...</p>
        </div>
      )}
    </main>
  )
}
