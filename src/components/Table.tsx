/* eslint-disable tailwindcss/no-custom-classname */
import React, { useEffect, useState, useMemo } from 'react'
import { Table, Badge } from '@radix-ui/themes'
import { useNavigate } from 'react-router'
import { getTasks, TaskDto } from 'services/TaskService'
import TaskStatistics from './TaskStatistics'
import TaskFilters from './TaskFilters'
import LearningPreferencesCard from './LearningPreferencesCard'
import { useTaskExecution } from 'contexts/TaskExecutionContext'
import CourseCard from './ui/CourseCard'

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
  const { updateExecutionData } = useTaskExecution()
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
    <div className="from-background to-muted/20 h-screen ">
      <div className="mx-auto w-full px-4 py-8 ">
        <div className="mt-6 flex flex-col gap-8 lg:flex-row">
          <div className="mx-auto w-full max-w-7xl flex-1 space-y-8">
            <div>
              <div className="mb-5 text-3xl">Kurse</div>
              <div className="flex w-full gap-4">
                <CourseCard
                  description="Programmieren 1"
                  coversrc="https://images.unsplash.com/photo-1615525137689-198778541af6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1332"
                />
                <CourseCard
                  description="OOP"
                  coversrc="https://plus.unsplash.com/premium_photo-1661877737564-3dfd7282efcb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1200"
                />
                <CourseCard
                  description="Software Engineering"
                  coversrc="https://plus.unsplash.com/premium_photo-1661964187664-e26f70e1a224?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1187"
                />
              </div>
            </div>
            <div>
              <div className="mb-5 text-3xl">Aufgaben</div>
              <div className="mx-auto w-full max-w-7xl space-y-6">
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
                <div className="min-w-full flex-1">
                  <div className="bg-card border-border overflow-hidden rounded-lg border shadow-sm">
                    <Table.Root className="w-full" variant="ghost" size="3">
                      <Table.Header className="border-border bg-muted/50 border-b">
                        <Table.Row className="grid grid-cols-3 text-left">
                          {['Status', 'Name', 'Schwierigkeit'].map((header) => (
                            <Table.ColumnHeaderCell
                              key={header}
                              className="text-muted-foreground px-6 py-4 text-sm font-semibold"
                            >
                              {header}
                            </Table.ColumnHeaderCell>
                          ))}
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        {filteredTasks.map((task, index) => (
                          <Table.Row
                            key={task.id}
                            className={`
                grid cursor-pointer grid-cols-3 transition-all duration-150 ease-in-out
                hover:bg-[#f5f5f5] hover:shadow-sm
                ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                border-border border-b last:border-b-0
              `}
                            onClick={() => {
                              updateExecutionData({ isCompiled: false })
                              navigate(`/task/${task.id}`)
                            }}
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
                                />
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
                        ? ' text-green-800 dark:text-green-300'
                        : task.difficulty === 'Medium'
                          ? ' text-yellow-800 dark:text-yellow-300'
                          : ' text-red-800 dark:text-red-300'
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

                    {filteredTasks.length === 0 && tasks.length > 0 && (
                      <div className="py-12 text-center">
                        <div className="bg-muted/50 mx-auto mb-4 flex size-24 items-center justify-center rounded-full">
                          <div className="bg-muted-foreground/20 size-8 rounded" />
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
                          <div className="bg-muted-foreground/20 size-8 rounded" />
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
              </div>
            </div>
          </div>
          <aside className="mr-10 w-full shrink-0 lg:sticky lg:top-24 lg:w-80">
            <div className="flex flex-col gap-8">
              <LearningPreferencesCard />
              <TaskStatistics stats={stats} layout="vertical" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default TasksTable
