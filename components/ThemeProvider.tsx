'use client'

import { useEffect } from 'react'
import { useFeedbackStore } from '@/store/feedback-store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useFeedbackStore((state) => state.theme)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.add('light')
    }
  }, [theme])

  return <>{children}</>
}
