import React from 'react';
import {Table, Badge} from "@radix-ui/themes";
import { useNavigate } from 'react-router';
import { tasks } from '../utils/temp/tasks';

const statusStyles = {
  'Not Started': 'bg-white text-gray-800 border border-gray-300',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
};

const TasksTable = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center">
      <Table.Root className="w-[80%] border border-gray-200 rounded-lg overflow-hidden">
        <Table.Header className="bg-gray-50">
          <Table.Row className="grid grid-cols-4 text-left">
            <Table.ColumnHeaderCell className="px-4 py-2 font-medium">Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="px-4 py-2 font-medium">Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="px-4 py-2 font-medium">Difficulty</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="px-4 py-2 font-medium">Solution</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className="divide-y divide-gray-100 bg-white">
          {tasks.map((task, idx) => (
            <Table.Row
              key={idx}
              className="grid grid-cols-4 cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/task/${encodeURIComponent(task.title)}`)}
            >
              <Table.RowHeaderCell className="px-4 py-2">
                <Badge
                  className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full ${
                    statusStyles[task.status]
                  }`}
                >
                  {task.status}
                </Badge>
              </Table.RowHeaderCell>
              <Table.Cell className="px-4 py-2">{task.title}</Table.Cell>
              <Table.Cell className="px-4 py-2">{task.difficulty}</Table.Cell>
              <Table.Cell className="px-4 py-2">{task.solution}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
  
  export default TasksTable;
  