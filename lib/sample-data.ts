import { Feedback } from '@/store/feedback-store'

export const sampleFeedbacks: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "Улучшить дизайн главной страницы",
    description: "Текущий дизайн выглядит устаревшим. Нужно обновить цветовую схему и добавить современные элементы интерфейса.",
    category: "UI",
    votes: 15,
    userVote: null,
  },
  {
    title: "Оптимизировать скорость загрузки",
    description: "Страницы загружаются слишком медленно, особенно на мобильных устройствах. Нужно оптимизировать изображения и код.",
    category: "Performance",
    votes: 23,
    userVote: null,
  },
  {
    title: "Добавить возможность экспорта данных",
    description: "Пользователи просят возможность экспортировать свои данные в различных форматах (CSV, JSON, PDF).",
    category: "Feature",
    votes: 8,
    userVote: null,
  },
  {
    title: "Исправить баг с сохранением настроек",
    description: "Настройки пользователя не сохраняются после перезагрузки страницы. Проблема проявляется в Firefox.",
    category: "Bug",
    votes: 31,
    userVote: null,
  },
  {
    title: "Добавить темную тему",
    description: "Многие пользователи просят добавить возможность переключения на темную тему для комфортной работы в вечернее время.",
    category: "UI",
    votes: 42,
    userVote: null,
  },
  {
    title: "Интеграция с внешними API",
    description: "Нужна возможность интеграции с популярными сервисами через API для синхронизации данных.",
    category: "Feature",
    votes: 12,
    userVote: null,
  }
]
