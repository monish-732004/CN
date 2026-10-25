'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
import { CHARACTERS, Character } from '@/lib/characters'

const CharacterPreview = dynamic(() => import('@/components/3d/CharacterPreview'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
      Loading 3D...
    </div>
  ),
})

interface TakenMap { [characterId: string]: boolean }

export default function JoinPage() {
  const { pin } = useParams<{ pin: string }>()
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [selectedChar, setSelectedChar] = useState<Character | null>(null)
  const [takenChars, setTakenChars] = useState<TakenMap>({})
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterAnime, setFilterAnime] = useState('')
  const [animState, setAnimState] = useState<'idle' | 'correct'>('idle')
  const [webglFailed, setWebglFailed] = useState(false)

  useEffect(() => {
    // Test WebGL support
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setWebglFailed(true)
    } catch {
      setWebglFailed(true)
    }
  }, [])

  // Group characters by anime
  const animes = [...new Set(CHARACTERS.map(c => c.anime))].sort()

  const filteredChars = CHARACTERS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.anime.toLowerCase().includes(search.toLowerCase())
    const matchAnime = !filterAnime || c.anime === filterAnime
    return matchSearch && matchAnime
  })

  const handleSelectChar = (char: Character) => {
    if (takenChars[char.id]) return
    setSelectedChar(char)
    setAnimState('correct')
    setTimeout(() => setAnimState('idle'), char.clickAction.duration)
  }

  const handleJoin = async () => {
    if (!nickname.trim()) { toast.error('Enter a nickname'); return }
    if (!selectedChar) { toast.error('Pick a character'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/event/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, nickname: nickname.trim(), characterId: selectedChar.id }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'character_taken') {
          toast.error('That character was just taken! Pick another.')
          setTakenChars(prev => ({ ...prev, [selectedChar.id]: true }))
          setSelectedChar(null)
        } else {
          toast.error(data.error || 'Failed to join')
        }
        return
      }

      sessionStorage.setItem('sessionToken', data.sessionToken)
      sessionStorage.setItem('participantId', data.participantId)
      sessionStorage.setItem('nickname', nickname.trim())
      sessionStorage.setItem('characterId', selectedChar.id)
      sessionStorage.setItem('eventId', data.currentState.eventId)

      router.push('/lobby')
    } catch {
      toast.error('Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg px-3 py-5">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="inline-block bg-card border border-white/10 rounded-full px-4 py-1 text-text-muted text-sm mb-2">
            PIN: <span className="font-mono text-primary font-bold">{pin}</span>
          </span>
          <h1 className="font-orbitron text-2xl md:text-3xl font-black text-text-main">Choose Your Fighter</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left: Character Gallery */}
          <div className="flex-1 min-w-0">
            {/* Search & Filter */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-card border border-white/10 rounded-lg px-3 py-2 text-sm text-text-main outline-none focus:border-primary"
              />
              <select
                value={filterAnime}
                onChange={e => setFilterAnime(e.target.value)}
                className="bg-card border border-white/10 rounded-lg px-2 py-2 text-xs text-text-main outline-none focus:border-primary"
              >
                <option value="">All</option>
                {animes.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Character Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[55vh] lg:max-h-[65vh] overflow-y-auto pr-1">
              {filteredChars.map(char => {
                const isTaken = !!takenChars[char.id]
                const isSelected = selectedChar?.id === char.id
                return (
                  <button
                    key={char.id}
                    disabled={isTaken}
                    onClick={() => handleSelectChar(char)}
                    className={`relative rounded-xl p-2.5 text-left border transition-all text-xs
                      ${isTaken ? 'opacity-40 cursor-not-allowed border-white/5 bg-surface' : 'cursor-pointer hover:border-white/30 bg-card active:scale-95'}
                      ${isSelected ? 'shadow-lg' : 'border-white/10'}
                    `}
                    style={isSelected ? { borderColor: char.color, boxShadow: `0 0 12px ${char.color}44` } : {}}
                  >
                    <div
                      className="w-8 h-8 rounded-full mb-1.5 flex items-center justify-center text-white font-bold text-sm mx-auto"
                      style={{ background: char.color }}
                    >
                      {char.name[0]}
                    </div>
                    <div className="font-semibold text-text-main truncate text-center">{char.name}</div>
                    <div className="text-text-muted truncate text-center" style={{ fontSize: '10px' }}>{char.anime}</div>
                    {isTaken && (
                      <span className="absolute top-1 right-1 bg-error/20 text-error text-[9px] rounded px-1">Taken</span>
                    )}
                    {isSelected && (
                      <span className="absolute top-1 right-1 text-[#FFD700] text-[10px]">✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: 3D Preview + Nickname */}
          <div className="lg:w-72 flex flex-col gap-3">
            {/* 3D Character Preview */}
            <div className="bg-card border border-white/10 rounded-2xl overflow-hidden" style={{ height: '220px' }}>
              {selectedChar ? (
                webglFailed ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold"
                      style={{ background: selectedChar.color }}
                    >
                      {selectedChar.name[0]}
                    </div>
                    <div className="text-text-muted text-xs text-center px-3">{selectedChar.description}</div>
                  </div>
                ) : (
                  <CharacterPreview character={selectedChar} animationState={animState} />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted text-sm text-center px-4">
                  Click a character to preview
                </div>
              )}
            </div>

            {/* Character info */}
            {selectedChar && (
              <div
                className="rounded-xl p-3 border text-xs"
                style={{ borderColor: selectedChar.color + '44', background: selectedChar.color + '11' }}
              >
                <div className="font-bold text-text-main">{selectedChar.name}</div>
                <div className="text-text-muted">{selectedChar.anime}</div>
                <div className="mt-1 italic" style={{ color: selectedChar.accentColor }}>
                  "{selectedChar.description}"
                </div>
                <div className="mt-1.5 text-text-muted" style={{ fontSize: '10px' }}>
                  Click again to replay: {selectedChar.clickAction.description.slice(0, 60)}...
                </div>
              </div>
            )}

            {/* Nickname + Join */}
            <div className="bg-card border border-white/10 rounded-2xl p-4">
              <label className="text-text-muted text-xs block mb-1.5">YOUR NICKNAME</label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value.slice(0, 20))}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
                placeholder="Enter nickname..."
                maxLength={20}
                className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-text-main outline-none focus:border-primary text-sm mb-3"
              />
              <button
                onClick={handleJoin}
                disabled={loading || !selectedChar || !nickname.trim()}
                className="w-full bg-gradient-to-r from-primary to-secondary text-bg font-orbitron font-bold py-3 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Joining...' : 'ENTER THE ARENA'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
