'use client'

import { FeedbackForm } from '@/components/FeedbackForm'
import { FeedbackList } from '@/components/FeedbackList'
import { FeedbackControls } from '@/components/FeedbackControls'
import { ThemeProvider } from '@/components/ThemeProvider'
import NoSSR from '@/components/NoSSR'

export default function Home() {
  return (
    <NoSSR fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Product Feedback Board...</p>
        </div>
      </div>
    }>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <FeedbackControls />
            <FeedbackForm />
            <FeedbackList />
          </div>
        </div>
      </ThemeProvider>
    </NoSSR>
  )
}
