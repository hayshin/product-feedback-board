'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useFeedbackStore, Feedback } from '@/store/feedback-store'
import { FeedbackItem } from './FeedbackItem'
import { GripVertical } from 'lucide-react'

interface SortableFeedbackItemProps {
  feedback: Feedback
}

function SortableFeedbackItem({ feedback }: SortableFeedbackItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: feedback.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-6 z-10 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      <div className="pl-8">
        <FeedbackItem feedback={feedback} />
      </div>
    </div>
  )
}

export function FeedbackList() {
  const { getFilteredAndSortedFeedbacks, updateFeedback } = useFeedbackStore()
  const filteredFeedbacks = getFilteredAndSortedFeedbacks()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = filteredFeedbacks.findIndex(item => item.id === active.id)
      const newIndex = filteredFeedbacks.findIndex(item => item.id === over?.id)

      const newOrder = arrayMove(filteredFeedbacks, oldIndex, newIndex)

      // Update the order in the store (simple approach - you might want to add an order field)
      newOrder.forEach((feedback, index) => {
        updateFeedback(feedback.id, { updatedAt: new Date(Date.now() + index) })
      })
    }
  }

  if (filteredFeedbacks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">
          Пока нет предложений
        </div>
        <p className="text-gray-500">
          Добавьте первое предложение, чтобы начать обсуждение!
        </p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={filteredFeedbacks.map(f => f.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFeedbacks.map((feedback) => (
              <motion.div
                key={feedback.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <SortableFeedbackItem feedback={feedback} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  )
}
