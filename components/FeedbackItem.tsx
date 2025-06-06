'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFeedbackStore, Feedback, FeedbackCategory } from '@/store/feedback-store'
import {
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Edit,
  Calendar,
  Tag,
  X,
  Check
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface FeedbackItemProps {
  feedback: Feedback
}

export function FeedbackItem({ feedback }: FeedbackItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(feedback.title)
  const [editDescription, setEditDescription] = useState(feedback.description)
  const [editCategory, setEditCategory] = useState(feedback.category)

  const { deleteFeedback, updateFeedback, voteFeedback } = useFeedbackStore()

  const handleVote = (vote: 'up' | 'down') => {
    voteFeedback(feedback.id, vote)
  }

  const handleDelete = () => {
    if (confirm('Удалить это предложение?')) {
      deleteFeedback(feedback.id)
    }
  }

  const handleSaveEdit = () => {
    if (editTitle.trim() && editDescription.trim()) {
      updateFeedback(feedback.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        category: editCategory,
      })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(feedback.title)
    setEditDescription(feedback.description)
    setEditCategory(feedback.category)
    setIsEditing(false)
  }

  const getCategoryColor = (category: FeedbackCategory) => {
    switch (category) {
      case 'UI': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Performance': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Feature': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'Bug': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
  }

  const getCategoryLabel = (category: FeedbackCategory) => {
    switch (category) {
      case 'UI': return 'UI/UX'
      case 'Performance': return 'Производительность'
      case 'Feature': return 'Функциональность'
      case 'Bug': return 'Исправление багов'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
    >
      {isEditing ? (
        <div className="space-y-4">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Заголовок"
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Описание"
            rows={3}
          />
          <Select value={editCategory} onValueChange={(value: FeedbackCategory) => setEditCategory(value)}>
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
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit}>
              <Check className="w-4 h-4 mr-1" />
              Сохранить
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              <X className="w-4 h-4 mr-1" />
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feedback.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {feedback.description}
              </p>
            </div>
            <div className="flex gap-1 ml-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(feedback.category)}`}>
                  {getCategoryLabel(feedback.category)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDistanceToNow(new Date(feedback.createdAt), {
                    addSuffix: true
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant={feedback.userVote === 'up' ? 'default' : 'outline'}
                  onClick={() => handleVote('up')}
                  className="h-8 px-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                <span className="font-medium text-lg px-2 min-w-[2rem] text-center">
                  {feedback.votes}
                </span>
                <Button
                  size="sm"
                  variant={feedback.userVote === 'down' ? 'default' : 'outline'}
                  onClick={() => handleVote('down')}
                  className="h-8 px-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
