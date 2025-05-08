import React from 'react'
import { Table, Badge } from '@radix-ui/themes'
import { useNavigate } from 'react-router'
import { tasks } from '../utils/temp/tasks'

const statusStyles = {
  'Not Started': 'orange',
  'In Progress': 'blue',
  Completed: 'green'
}

const TasksTable = () => {
  const navigate = useNavigate()

  return (
    <div className="mt-20 flex items-center justify-center">
      <Table.Root
        className="w-4/5 overflow-hidden rounded-lg border-transparent"
        variant="ghost"
      >
        <Table.Header className="">
          <Table.Row className="grid grid-cols-4 text-left">
            <Table.ColumnHeaderCell className="px-4 py-2 font-medium text-white">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="px-4 py-2 font-medium text-white">
              Title
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="px-4 py-2 font-medium text-white">
              Difficulty
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="px-4 py-2 font-medium text-white">
              Solution
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className="divide-y divide-[#262626]">
          {tasks.map((task, idx) => {
            // Determine the badge color based on status, with a fallback
            const badgeColor = statusStyles[task.status] || 'gray'

            return (
              <Table.Row
                key={idx}
                className="grid cursor-pointer grid-cols-4 hover:bg-[#262626]"
                onClick={() =>
                  navigate(`/task/${encodeURIComponent(task.title)}`)
                }
              >
                <Table.RowHeaderCell className="px-4 py-2">
                  <Badge
                    color={badgeColor}
                    className="inline-flex items-center rounded-full px-2 py-1 text-sm font-medium"
                  >
                    {task.status}
                  </Badge>
                </Table.RowHeaderCell>
                <Table.Cell className="px-4 py-2 text-white">
                  {task.title}
                </Table.Cell>
                <Table.Cell className="px-4 py-2 text-white">
                  {task.difficulty}
                </Table.Cell>
                <Table.Cell className="px-4 py-2 text-white">
                  {task.solution}
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </div>
  )
}

export default TasksTable
