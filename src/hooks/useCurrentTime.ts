"use client"

import { useState, useEffect } from 'react'
import { formatTime } from '@/lib/utils'

export function useCurrentTime() {
  const [time, setTime] = useState<string>(formatTime(new Date()))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(new Date()))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return time
}
