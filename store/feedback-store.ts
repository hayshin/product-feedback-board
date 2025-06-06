import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export type FeedbackCategory = 'UI' | 'Performance' | 'Feature' | 'Bug'
export type SortBy = 'date' | 'popularity' | 'category'
export type Theme = 'light' | 'dark'

export interface Feedback {
  id: string
  title: string
  description: string
  category: FeedbackCategory
  votes: number
  createdAt: Date
  updatedAt: Date
  userVote?: 'up' | 'down' | null
}

interface FeedbackStore {
  // State
  feedbacks: Feedback[]
  sortBy: SortBy
  filterByCategory: FeedbackCategory | 'all'
  theme: Theme
  isLoading: boolean

  // Actions
  addFeedback: (feedback: Omit<Feedback, 'id' | 'votes' | 'createdAt' | 'updatedAt'>) => void
  deleteFeedback: (id: string) => void
  updateFeedback: (id: string, updates: Partial<Feedback>) => void
  voteFeedback: (id: string, vote: 'up' | 'down') => void
  setSortBy: (sortBy: SortBy) => void
  setFilterByCategory: (category: FeedbackCategory | 'all') => void
  setTheme: (theme: Theme) => void
  loadSampleData: () => void

  // Computed
  getTotalFeedbacks: () => number
  getFilteredAndSortedFeedbacks: () => Feedback[]
  getWeeklyStats: () => { feedbacks: number; votes: number }
  exportData: () => string
  importData: (data: string) => void
}

export const useFeedbackStore = create<FeedbackStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        feedbacks: [],
        sortBy: 'date',
        filterByCategory: 'all',
        theme: 'light',
        isLoading: false,

        // Actions
        addFeedback: (feedbackData) => {
          const newFeedback: Feedback = {
            ...feedbackData,
            id: crypto.randomUUID(),
            votes: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            userVote: null,
          }
          set((state) => ({
            feedbacks: [...state.feedbacks, newFeedback],
          }))
        },

        deleteFeedback: (id) => {
          set((state) => ({
            feedbacks: state.feedbacks.filter((f) => f.id !== id),
          }))
        },

        updateFeedback: (id, updates) => {
          set((state) => ({
            feedbacks: state.feedbacks.map((f) =>
              f.id === id ? { ...f, ...updates, updatedAt: new Date() } : f
            ),
          }))
        },

        voteFeedback: (id, vote) => {
          set((state) => ({
            feedbacks: state.feedbacks.map((f) => {
              if (f.id !== id) return f

              let newVotes = f.votes
              const prevVote = f.userVote

              // Remove previous vote
              if (prevVote === 'up') newVotes--
              if (prevVote === 'down') newVotes++

              // Add new vote
              if (vote === 'up') newVotes++
              if (vote === 'down') newVotes--

              return {
                ...f,
                votes: newVotes,
                userVote: f.userVote === vote ? null : vote,
              }
            }),
          }))
        },

        setSortBy: (sortBy) => set({ sortBy }),
        setFilterByCategory: (filterByCategory) => set({ filterByCategory }),
        setTheme: (theme) => set({ theme }),

        loadSampleData: () => {
          const sampleFeedbacks = [
            {
              title: "Улучшить дизайн главной страницы",
              description: "Текущий дизайн выглядит устаревшим. Нужно обновить цветовую схему и добавить современные элементы интерфейса.",
              category: "UI" as FeedbackCategory,
              votes: 15,
              userVote: null,
            },
            {
              title: "Оптимизировать скорость загрузки",
              description: "Страницы загружаются слишком медленно, особенно на мобильных устройствах. Нужно оптимизировать изображения и код.",
              category: "Performance" as FeedbackCategory,
              votes: 23,
              userVote: null,
            },
            {
              title: "Добавить возможность экспорта данных",
              description: "Пользователи просят возможность экспортировать свои данные в различных форматах (CSV, JSON, PDF).",
              category: "Feature" as FeedbackCategory,
              votes: 8,
              userVote: null,
            },
            {
              title: "Исправить баг с сохранением настроек",
              description: "Настройки пользователя не сохраняются после перезагрузки страницы. Проблема проявляется в Firefox.",
              category: "Bug" as FeedbackCategory,
              votes: 31,
              userVote: null,
            },
            {
              title: "Добавить темную тему",
              description: "Многие пользователи просят добавить возможность переключения на темную тему для комфортной работы в вечернее время.",
              category: "UI" as FeedbackCategory,
              votes: 42,
              userVote: null,
            },
            {
              title: "Интеграция с внешними API",
              description: "Нужна возможность интеграции с популярными сервисами через API для синхронизации данных.",
              category: "Feature" as FeedbackCategory,
              votes: 12,
              userVote: null,
            }
          ]

          const feedbacksWithIds = sampleFeedbacks.map(feedback => ({
            ...feedback,
            id: crypto.randomUUID(),
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
            updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          }))

          set({ feedbacks: feedbacksWithIds })
        },

        // Computed
        getTotalFeedbacks: () => get().feedbacks.length,

        getFilteredAndSortedFeedbacks: () => {
          const { feedbacks, sortBy, filterByCategory } = get()

          let filtered = feedbacks
          if (filterByCategory !== 'all') {
            filtered = feedbacks.filter((f) => f.category === filterByCategory)
          }

          return filtered.sort((a, b) => {
            switch (sortBy) {
              case 'popularity':
                return b.votes - a.votes
              case 'category':
                return a.category.localeCompare(b.category)
              case 'date':
              default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
          })
        },

        getWeeklyStats: () => {
          const { feedbacks } = get()
          const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

          const weeklyFeedbacks = feedbacks.filter(
            (f) => new Date(f.createdAt) > oneWeekAgo
          )

          const weeklyVotes = weeklyFeedbacks.reduce((sum, f) => sum + f.votes, 0)

          return {
            feedbacks: weeklyFeedbacks.length,
            votes: weeklyVotes,
          }
        },

        exportData: () => {
          const { feedbacks, sortBy, filterByCategory, theme } = get()
          return JSON.stringify({
            feedbacks,
            sortBy,
            filterByCategory,
            theme,
            exportedAt: new Date().toISOString(),
          }, null, 2)
        },

        importData: (data) => {
          try {
            const parsed = JSON.parse(data)
            set({
              feedbacks: parsed.feedbacks || [],
              sortBy: parsed.sortBy || 'date',
              filterByCategory: parsed.filterByCategory || 'all',
              theme: parsed.theme || 'light',
            })
          } catch (error) {
            console.error('Failed to import data:', error)
          }
        },
      }),
      {
        name: 'feedback-store',
        partialize: (state) => ({
          feedbacks: state.feedbacks,
          sortBy: state.sortBy,
          filterByCategory: state.filterByCategory,
          theme: state.theme,
        }),
      }
    ),
    { name: 'feedback-store' }
  )
)
