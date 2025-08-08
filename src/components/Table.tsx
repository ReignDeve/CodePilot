import React, { useEffect, useState } from 'react'
import { Table, Badge } from '@radix-ui/themes'
import { useNavigate } from 'react-router'
import { getTasks, TaskDto } from 'services/TaskService'

const statusStyles: Record<TaskDto['status'], 'orange' | 'blue' | 'green'> = {
  NotStarted: 'orange',
  InProgress: 'blue',
  Completed: 'green'
}

/**
 * Aufgaben‐Tabelle
 * UI‑Aufhübschung: sanfter Dark‑Mode + Hover + Streifen + sticky Header.
 * Logik bleibt unverändert.
 */

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

  if (loading)
    return <p className="mt-20 text-center text-white">Lade Aufgaben…</p>
  if (error) return <p className="mt-20 text-center text-red-600">{error}</p>

  return (
    <div className="mt-16 flex justify-center px-4">
      <Table.Root
        className="w-3/5  overflow-hidden rounded-lg shadow-lg"
        variant="ghost"
      >
        {/* Header */}
        <Table.Header className="border-b border-[#333]">
          <Table.Row className="grid grid-cols-3 text-left">
            {['Status', 'Title', 'Difficulty'].map((h) => (
              <Table.ColumnHeaderCell
                key={h}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wide"
              >
                {h}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        {/* Body */}
        <Table.Body>
          {tasks.map((t) => (
            <Table.Row
              key={t.id}
              className="grid cursor-pointer grid-cols-3 transition-colors duration-150"
              onClick={() => navigate(`/task/${t.id}`)}
            >
              <Table.RowHeaderCell className="px-6 py-3">
                <Badge
                  color={statusStyles[t.status]}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
                >
                  {t.status.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              </Table.RowHeaderCell>
              <Table.Cell className="px-6 py-3 text-sm  whitespace-nowrap">
                {t.title}
              </Table.Cell>
              <Table.Cell className="px-6 py-3 text-sm  capitalize whitespace-nowrap">
                {t.difficulty}
              </Table.Cell>
              {/* <Table.Cell className="px-6 py-3 text-sm ">
                {t.solution}
              </Table.Cell> */}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}

export default TasksTable
