'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFeedbackStore, FeedbackCategory, SortBy } from '@/store/feedback-store'
import { Filter, ArrowUpDown, BarChart3, Download, Upload, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'

export function FeedbackControls() {
  const {
    sortBy,
    filterByCategory,
    theme,
    setSortBy,
    setFilterByCategory,
    setTheme,
    getTotalFeedbacks,
    getWeeklyStats,
    exportData,
    importData,
    loadSampleData,
  } = useFeedbackStore()

  const [showStats, setShowStats] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const totalFeedbacks = getTotalFeedbacks()
  const weeklyStats = getWeeklyStats()

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `feedback-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const data = event.target?.result as string
          importData(data)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Header with stats and theme toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Feedback Board
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Всего предложений: {isClient ? totalFeedbacks : 0}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Статистика
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Stats panel */}
      {showStats && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
            Статистика за неделю
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400">Новых предложений</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {isClient ? weeklyStats.feedbacks : 0}
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Голосов</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {isClient ? weeklyStats.votes : 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Ручная сортировка</SelectItem>
              <SelectItem value="date">По дате</SelectItem>
              <SelectItem value="popularity">По популярности</SelectItem>
              <SelectItem value="category">По категории</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select
            value={filterByCategory}
            onValueChange={(value: FeedbackCategory | 'all') => setFilterByCategory(value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              <SelectItem value="UI">UI/UX</SelectItem>
              <SelectItem value="Performance">Производительность</SelectItem>
              <SelectItem value="Feature">Функциональность</SelectItem>
              <SelectItem value="Bug">Исправление багов</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 ml-auto">
          {isClient && totalFeedbacks === 0 && (
            <Button variant="outline" size="sm" onClick={loadSampleData}>
              <Download className="w-4 h-4 mr-2" />
              Загрузить примеры
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            Импорт
          </Button>
        </div>
      </div>

      {/* Current filters display */}
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Сортировка: <span className="font-medium">{getSortLabel(sortBy)}</span>
        {filterByCategory !== 'all' && (
          <>
            {' • '}
            Фильтр: <span className="font-medium">{getCategoryLabel(filterByCategory)}</span>
          </>
        )}
      </div>
    </div>
  )
}

function getSortLabel(sortBy: SortBy): string {
  switch (sortBy) {
    case 'manual':
      return 'Ручная сортировка'
    case 'date':
      return 'По дате'
    case 'popularity':
      return 'По популярности'
    case 'category':
      return 'По категории'
    default:
      return 'По дате'
  }
}

function getCategoryLabel(category: FeedbackCategory): string {
  switch (category) {
    case 'UI':
      return 'UI/UX'
    case 'Performance':
      return 'Производительность'
    case 'Feature':
      return 'Функциональность'
    case 'Bug':
      return 'Исправление багов'
    default:
      return category
  }
}
