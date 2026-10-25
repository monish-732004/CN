'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/hooks/useSocket'
import { useGameStore } from '@/hooks/useGameState'
import { CHARACTERS } from '@/lib/characters'

export default function LobbyPage() {
  const router = useRouter()
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [participantId, setParticipantId] = useState<string | null>(null)
  const [eventId, setEventId] = useState<string | null>(null)
  const [nickname, setNickname] = useState('')
  const [characterId, setCharacterId] = useState('')

  const { participants, phase } = useGameStore()

  useEffect(() => {
    const token = sessionStorage.getItem('sessionToken')
    const pid = sessionStorage.getItem('participantId')
    const eid = sessionStorage.getItem('eventId')
    const nick = sessionStorage.getItem('nickname') ?? ''
    const cid = sessionStorage.getItem('characterId') ?? ''

    if (!token || !pid || !eid) {
      router.replace('/')
      return
    }

    setSessionToken(token)
    setParticipantId(pid)
    setEventId(eid)
    setNickname(nick)
    setCharacterId(cid)
  }, [router])

  // Socket subscription
  useSocket(eventId, participantId)

  // Navigate to quiz when game starts
  useEffect(() => {
    if (phase === 'question_active') {
      router.push('/quiz')
    }
  }, [phase, router])

  const myChar = CHARACTERS.find(c => c.id === characterId)

  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-2xl font-black text-text-main">Waiting for the game to start...</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-text-muted text-sm">Connected</span>
          </div>
        </div>

        {/* My character */}
        {myChar && (
          <div
            className="rounded-2xl p-4 border mb-6 text-center"
            style={{ background: myChar.color + '18', borderColor: myChar.color + '55' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-2 mx-auto"
              style={{ background: myChar.color }}
            >
              {myChar.name[0]}
            </div>
            <div className="font-semibold text-text-main">{nickname}</div>
            <div className="text-text-muted text-xs">{myChar.name} · {myChar.anime}</div>
          </div>
        )}

        {/* Participants list */}
        <div className="bg-card border border-white/10 rounded-2xl p-4">
          <h2 className="font-orbitron text-sm text-text-muted mb-3">
            PLAYERS READY ({participants.length})
          </h2>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {participants.map(p => {
              const char = CHARACTERS.find(c => c.id === p.characterId)
              return (
                <div key={p.participantId} className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: char?.color ?? '#888' }}
                  >
                    {p.nickname[0]}
                  </div>
                  <span className="text-text-main text-sm truncate">{p.nickname}</span>
                </div>
              )
            })}
          </div>
          {participants.length === 0 && (
            <p className="text-text-muted text-xs text-center">Be the first to join!</p>
          )}
        </div>

        <p className="text-text-muted text-xs text-center mt-4">
          The teacher will start the quiz. Get ready!
        </p>
      </div>
    </main>
  )
}
