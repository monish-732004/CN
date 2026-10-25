'use client'
import { useState, useEffect, useRef } from 'react'

export function useTimer(deadline: number, onExpire?: () => void) {
  const [timeLeft, setTimeLeft] = useState(0)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (!deadline) { setTimeLeft(0); return }

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining === 0 && onExpireRef.current) {
        onExpireRef.current()
      }
    }

    tick()
    const interval = setInterval(tick, 200)
    return () => clearInterval(interval)
  }, [deadline])

  return timeLeft
}
