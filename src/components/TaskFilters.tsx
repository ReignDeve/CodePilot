import React from 'react'
import { TaskDto } from 'services/TaskService'

interface TaskFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: TaskDto['status'] | 'All'
  setStatusFilter: (status: TaskDto['status'] | 'All') => void
  difficultyFilter: TaskDto['difficulty'] | 'All'
  setDifficultyFilter: (difficulty: TaskDto['difficulty'] | 'All') => void
  filteredTasksCount: number
  totalTasksCount: number
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  difficultyFilter,
  setDifficultyFilter,
  filteredTasksCount,
  totalTasksCount
}) => {
  return (
    <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Search */}
        <div className="flex-1">
          <label
            htmlFor="search"
            className="text-muted-foreground mb-2 block text-sm font-medium"
          >
            Suche
          </label>
          <input
            id="search"
            type="text"
            placeholder="Nach Aufgaben suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="lg:w-48">
          <label
            htmlFor="status-filter"
            className="text-muted-foreground mb-2 block text-sm font-medium"
          >
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as TaskDto['status'] | 'All')
            }
            className="border-border bg-background text-foreground w-full rounded-lg border px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">Alle Status</option>
            <option value="NotStarted">Nicht begonnen</option>
            <option value="InProgress">In Bearbeitung</option>
            <option value="Completed">Abgeschlossen</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="lg:w-48">
          <label
            htmlFor="difficulty-filter"
            className="text-muted-foreground mb-2 block text-sm font-medium"
          >
            Schwierigkeit
          </label>
          <select
            id="difficulty-filter"
            value={difficultyFilter}
            onChange={(e) =>
              setDifficultyFilter(
                e.target.value as TaskDto['difficulty'] | 'All'
              )
            }
            className="border-border bg-background text-foreground w-full rounded-lg border px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">Alle Schwierigkeiten</option>
            <option value="Easy">Einfach</option>
            <option value="Medium">Mittel</option>
            <option value="Hard">Schwer</option>
          </select>
        </div>
      </div>

      {/* Results Counter
      <div className="border-border mt-4 border-t pt-4">
        <p className="text-muted-foreground text-sm">
          {filteredTasksCount} von {totalTasksCount} Aufgaben werden
          angezeigt
          {searchTerm && ` • Suche: "${searchTerm}"`}
          {statusFilter !== 'All' &&
            ` • Status: ${statusFilter.replace(/([A-Z])/g, ' $1').trim()}`}
          {difficultyFilter !== 'All' &&
            ` • Schwierigkeit: ${difficultyFilter}`}
        </p>
      </div> */}
    </div>
  )
}

export default TaskFilters
