'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function HomePage() {
  const [pin, setPin] = useState('')
  const router = useRouter()

  const handleJoin = () => {
    const cleaned = pin.trim().replace(/\D/g, '')
    if (cleaned.length !== 6) {
      toast.error('Enter a 6-digit PIN')
      return
    }
    router.push(`/join/${cleaned}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-orbitron text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-fade-in">
            NeuralQuiz
          </h1>
          <p className="text-text-muted mt-2 text-sm">Anime · Computer Networks · ₹100 Prize</p>
        </div>

        {/* PIN Entry */}
        <div className="bg-card border border-white/10 rounded-2xl p-6 shadow-2xl">
          <p className="text-text-muted text-sm text-center mb-4">Enter the 6-digit PIN from your screen</p>
          <input
            type="number"
            inputMode="numeric"
            value={pin}
            onChange={e => setPin(e.target.value.slice(0, 6))}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            placeholder="000000"
            className="w-full bg-surface text-text-main text-center text-3xl font-mono tracking-widest border border-white/20 rounded-xl px-4 py-4 outline-none focus:border-primary transition-colors"
            maxLength={6}
          />
          <button
            onClick={handleJoin}
            className="w-full mt-4 bg-gradient-to-r from-primary to-secondary text-bg font-orbitron font-bold py-3 rounded-xl text-lg hover:opacity-90 active:scale-95 transition-all"
          >
            JOIN
          </button>
        </div>

        {/* Teacher link */}
        <div className="text-center mt-6">
          <a
            href="/teacher"
            className="text-text-muted text-sm hover:text-primary transition-colors underline underline-offset-2"
          >
            Teacher? Open control panel →
          </a>
        </div>
      </div>
    </main>
  )
}
