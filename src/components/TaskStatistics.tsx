/* eslint-disable tailwindcss/no-custom-classname */
import React from 'react'

interface TaskStats {
  total: number
  completed: number
  inProgress: number
  notStarted: number
  completionRate: number
}

interface TaskStatisticsProps {
  stats: TaskStats
  layout?: 'horizontal' | 'vertical'
}

const TaskStatistics: React.FC<TaskStatisticsProps> = ({
  stats,
  layout = 'horizontal'
}) => {
  const containerClass =
    layout === 'vertical'
      ? 'space-y-4'
      : 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'

  return (
    <div className={containerClass}>
      <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Gesamt</p>
            <p className="text-foreground text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="size-6 rounded bg-blue-600"></div>
        </div>
      </div>

      <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Abgeschlossen
            </p>
            <p className="text-3xl font-bold text-green-600">
              {stats.completed}
            </p>
          </div>
          <div className="size-6 rounded-full bg-green-600"></div>
        </div>
      </div>

      <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              In Bearbeitung
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.inProgress}
            </p>
          </div>
          <div className="size-6 animate-pulse rounded-lg bg-blue-600"></div>
        </div>
      </div>

      <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Fortschritt
            </p>
            <p className="text-foreground text-3xl font-bold">
              {stats.completionRate}%
            </p>
          </div>
          <div className="relative size-6 overflow-hidden rounded-full bg-orange-600">
            <div
              className="absolute bottom-0 left-0 bg-orange-400 transition-all duration-500"
              style={{
                height: `${stats.completionRate}%`,
                width: '100%'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskStatistics
