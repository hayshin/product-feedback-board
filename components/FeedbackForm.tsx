'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFeedbackStore, FeedbackCategory } from '@/store/feedback-store'
import { Plus } from 'lucide-react'

export function FeedbackForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<FeedbackCategory>('Feature')
  const [isOpen, setIsOpen] = useState(false)

  const addFeedback = useFeedbackStore((state) => state.addFeedback)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) return

    addFeedback({
      title: title.trim(),
      description: description.trim(),
      category,
    })

    setTitle('')
    setDescription('')
    setCategory('Feature')
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Добавить предложение
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Новое предложение
      </h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Заголовок</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Краткое описание идеи..."
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Подробное описание предложения..."
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Категория</Label>
          <Select value={category} onValueChange={(value: FeedbackCategory) => setCategory(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UI">UI/UX</SelectItem>
              <SelectItem value="Performance">Производительность</SelectItem>
              <SelectItem value="Feature">Функциональность</SelectItem>
              <SelectItem value="Bug">Исправление багов</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" size="sm">
            Добавить
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            Отмена
          </Button>
        </div>
      </div>
    </form>
  )
}
