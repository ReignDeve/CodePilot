import React, { useEffect, useState } from 'react'
import { Table, Badge } from '@radix-ui/themes'
import { useNavigate } from 'react-router'
import { getTasks, TaskDto } from 'services/TaskService'

const statusStyles: Record<TaskDto['status'], 'orange' | 'blue' | 'green'> = {
  NotStarted: 'orange',
  InProgress: 'blue',
  Completed: 'green'
}

const TasksTable: React.FC = () => {
  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [loading, setLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getTasks()
      .then((data: React.SetStateAction<TaskDto[]>) => setTasks(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoad(false))
  }, [])

  if (loading) return <p className="mt-20 text-center">Lade Aufgaben…</p>
  if (error) return <p className="mt-20 text-center text-red-600">{error}</p>

  return (
    <div className="mt-20 flex items-center justify-center">
      <Table.Root
        className="w-4/5 overflow-hidden rounded-lg border-transparent"
        variant="ghost"
      >
        {/* Header */}
        <Table.Header>
          <Table.Row className="grid grid-cols-4 text-left">
            {['Status', 'Title', 'Difficulty', 'Solution'].map((h) => (
              <Table.ColumnHeaderCell
                key={h}
                className="px-4 py-2 font-medium text-white"
              >
                {h}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        {/* Body */}
        <Table.Body className="divide-y divide-[#262626]">
          {tasks.map((t) => (
            <Table.Row
              key={t.id}
              className="grid cursor-pointer grid-cols-4 hover:bg-[#262626]"
              onClick={() => navigate(`/task/${t.id}`)}
            >
              <Table.RowHeaderCell className="px-4 py-2">
                <Badge
                  color={statusStyles[t.status]}
                  className="inline-flex items-center rounded-full px-2 py-1 text-sm font-medium"
                >
                  {t.status.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              </Table.RowHeaderCell>
              <Table.Cell className="px-4 py-2 text-white">
                {t.title}
              </Table.Cell>
              <Table.Cell className="px-4 py-2 text-white">
                {t.difficulty}
              </Table.Cell>
              <Table.Cell className="px-4 py-2 text-white">
                {t.solution}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}

export default TasksTable
