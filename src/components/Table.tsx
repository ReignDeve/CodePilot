/* eslint-disable tailwindcss/no-custom-classname */
import React, { useEffect, useState, useMemo } from 'react'
import { Table, Badge } from '@radix-ui/themes'
import { useNavigate } from 'react-router'
import { getTasks, TaskDto } from 'services/TaskService'
import TaskStatistics from './TaskStatistics'
import TaskFilters from './TaskFilters'
import LearningPreferencesCard from './LearningPreferencesCard'

const statusStyles: Record<TaskDto['status'], 'orange' | 'blue' | 'green'> = {
  NotStarted: 'orange',
  InProgress: 'blue',
  Completed: 'green'
}

const TasksTable: React.FC = () => {
  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [loading, setLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskDto['status'] | 'All'>(
    'All'
  )
  const [difficultyFilter, setDifficultyFilter] = useState<
    TaskDto['difficulty'] | 'All'
  >('All')
  const navigate = useNavigate()

  // Filtered tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === 'All' || task.status === statusFilter
      const matchesDifficulty =
        difficultyFilter === 'All' || task.difficulty === difficultyFilter
      return matchesSearch && matchesStatus && matchesDifficulty
    })
  }, [tasks, searchTerm, statusFilter, difficultyFilter])

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === 'Completed').length
    const inProgress = tasks.filter((t) => t.status === 'InProgress').length
    const notStarted = tasks.filter((t) => t.status === 'NotStarted').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, inProgress, notStarted, completionRate }
  }, [tasks])

  useEffect(() => {
    getTasks()
      .then((data: React.SetStateAction<TaskDto[]>) => setTasks(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoad(false))
  }, [])

  if (loading) {
    return (
      <div className="mt-20 flex justify-center">
        <div className="flex items-center space-x-3">
          <div className="size-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <p className="text-foreground text-center">Lade Aufgaben…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-20 flex justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-center text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="from-background to-muted/20 h-screen bg-gradient-to-br px-4 py-8">
      <div className="mx-auto max-w-[80%]  space-y-8">
        {/* Search and Filter Section */}
        <TaskFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          filteredTasksCount={filteredTasks.length}
          totalTasksCount={tasks.length}
        />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Sidebar - Statistics */}
          <div className="lg:col-span-2">
            <TaskStatistics stats={stats} layout="vertical" />
          </div>

          {/* Center - Tasks Table */}
          <div className="lg:col-span-8">
            <div className="bg-card border-border overflow-hidden rounded-lg border shadow-sm">
              <Table.Root className="w-full" variant="ghost">
                {/* Header */}
                <Table.Header className="border-border bg-muted/50 border-b">
                  <Table.Row className="grid grid-cols-3 text-left">
                    {['Status', 'Title', 'Difficulty'].map((header) => (
                      <Table.ColumnHeaderCell
                        key={header}
                        className="text-muted-foreground px-6 py-4 text-sm font-semibold"
                      >
                        {header}
                      </Table.ColumnHeaderCell>
                    ))}
                  </Table.Row>
                </Table.Header>

                {/* Body */}
                <Table.Body>
                  {filteredTasks.map((task, index) => (
                    <Table.Row
                      key={task.id}
                      className={`
                    hover:bg-muted/50 grid cursor-pointer grid-cols-3 transition-all duration-150
                    ease-in-out hover:shadow-sm
                    ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                    border-border border-b last:border-b-0
                  `}
                      onClick={() => navigate(`/task/${task.id}`)}
                    >
                      <Table.RowHeaderCell className="flex items-center px-6 py-4">
                        <Badge
                          color={statusStyles[task.status]}
                          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                        >
                          <div
                            className={`size-2 rounded-full ${
                              task.status === 'NotStarted'
                                ? 'bg-orange-500'
                                : task.status === 'InProgress'
                                  ? 'bg-blue-500'
                                  : 'bg-green-500'
                            }`}
                          ></div>
                          {task.status.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      </Table.RowHeaderCell>

                      <Table.Cell className="text-foreground flex items-center px-6 py-4 text-sm font-medium">
                        <span className="truncate">{task.title}</span>
                      </Table.Cell>

                      <Table.Cell className="text-muted-foreground flex items-center px-6 py-4 text-sm capitalize">
                        <span
                          className={`
                      inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                      ${
                        task.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : task.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }
                    `}
                        >
                          {task.difficulty}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>

              {/* Empty State */}
              {filteredTasks.length === 0 && tasks.length > 0 && (
                <div className="py-12 text-center">
                  <div className="bg-muted/50 mx-auto mb-4 flex size-24 items-center justify-center rounded-full">
                    <div className="bg-muted-foreground/20 size-8 rounded"></div>
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-medium">
                    Keine Aufgaben gefunden
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Versuche deine Suchkriterien oder Filter anzupassen
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('All')
                      setDifficultyFilter('All')
                    }}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    Filter zurücksetzen
                  </button>
                </div>
              )}

              {tasks.length === 0 && (
                <div className="py-12 text-center">
                  <div className="bg-muted/50 mx-auto mb-4 flex size-24 items-center justify-center rounded-full">
                    <div className="bg-muted-foreground/20 size-8 rounded"></div>
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-medium">
                    Keine Aufgaben vorhanden
                  </h3>
                  <p className="text-muted-foreground">
                    Es wurden noch keine Aufgaben erstellt
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Learning Preferences */}
          <div className="lg:col-span-2">
            <LearningPreferencesCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TasksTable
