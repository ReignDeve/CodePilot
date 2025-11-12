/* eslint-disable tailwindcss/no-custom-classname */
import React from 'react'

type TaskStatisticsProps = {
  stats: {
    total: number
    completed: number
    inProgress: number
    completionRate: number // 0..100
  }
  /** steuert nur das Innenlayout */
  layout?: 'horizontal' | 'vertical'
}

const Stat = ({
  label,
  value,
  icon
}: {
  label: string
  value: React.ReactNode
  icon: React.ReactNode
}) => (
  <div className="flex items-center gap-3">
    <div className="bg-background/60 ring-border grid size-10 shrink-0 place-items-center rounded-xl ring-1">
      {icon}
    </div>
    <div>
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <div className="text-foreground text-2xl font-bold leading-tight">
        {value}
      </div>
    </div>
  </div>
)

const ProgressRing = ({ percent }: { percent: number }) => {
  const clamped = Math.max(0, Math.min(100, percent))
  const deg = clamped * 3.6
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid place-items-center">
        <div className="size-16 rounded-full bg-gradient-to-tr from-orange-500/40 to-pink-500/30 p-[2px]">
          <div className="bg-card grid size-full place-items-center rounded-full">
            <div
              className="grid size-12 place-items-center rounded-full"
              style={{
                background: `conic-gradient(#fb923c ${deg}deg, rgba(148,163,184,0.18) 0deg)`
              }}
            >
              <div className="bg-card text-foreground grid size-9 place-items-center rounded-full text-xs font-bold">
                {clamped}%
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="text-muted-foreground text-xs font-medium">Fortschritt</p>
        <p className="text-foreground text-2xl font-bold leading-tight">
          {clamped}%
        </p>
      </div>
    </div>
  )
}

const TaskStatistics: React.FC<TaskStatisticsProps> = ({
  stats,
  layout = 'horizontal'
}) => {
  const grid =
    layout === 'vertical'
      ? 'grid grid-cols-1 gap-6'
      : 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]'

  return (
    <section
      aria-labelledby="task-stats"
      className="border-border bg-card/80 relative overflow-hidden rounded-2xl border shadow-sm"
    >
      {/* zarter Akzent */}
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full  blur-2xl" />

      {/* Header */}
      <header className="border-border/60 flex items-center justify-between border-b px-5 py-4">
        <h3
          id="task-stats"
          className="text-muted-foreground text-sm font-medium"
        >
          Aufgaben-Übersicht
        </h3>
        <span className="bg-background ring-border rounded-full px-2.5 py-1 text-xs font-medium ring-1">
          {stats.total} gesamt
        </span>
      </header>

      {/* Content */}
      <div className={`${grid} p-5`}>
        <Stat
          label="Gesamt"
          value={stats.total}
          icon={
            <svg
              viewBox="0 0 24 24"
              className="size-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M3 5h18M3 12h18M3 19h18" />
            </svg>
          }
        />
        <Stat
          label="Abgeschlossen"
          value={<span className="text-green-600">{stats.completed}</span>}
          icon={
            <svg
              viewBox="0 0 24 24"
              className="size-5 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          }
        />
        <Stat
          label="In Bearbeitung"
          value={<span className="text-blue-600">{stats.inProgress}</span>}
          icon={
            <svg
              viewBox="0 0 24 24"
              className="size-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          }
        />

        {/* Progress-Ring immer am Ende */}
        <div className="sm:col-span-2 xl:col-span-1 xl:justify-self-start">
          <ProgressRing percent={stats.completionRate} />
        </div>
      </div>
    </section>
  )
}

export default TaskStatistics
