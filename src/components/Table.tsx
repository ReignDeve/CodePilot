import React from 'react';
import {Table, Badge} from "@radix-ui/themes";
import { useNavigate } from 'react-router';
import { tasks } from '../utils/temp/tasks';

const statusStyles = {
  'Not Started': 'bg-white text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
};

const TasksTable = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center mt-20">
      <Table.Root className="w-[80%] border-transparent rounded-lg overflow-hidden" variant='ghost'>
        <Table.Header className="">
          <Table.Row className="grid grid-cols-4 text-left">
            <Table.ColumnHeaderCell className="px-4 py-2 font-medium text-white">Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="px-4 py-2 font-medium text-white">Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="px-4 py-2 font-medium text-white">Difficulty</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="px-4 py-2 font-medium text-white">Solution</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className="divide-y divide-[#262626]">
          {tasks.map((task, idx) => (
            <Table.Row
              key={idx}
              className="grid grid-cols-4 cursor-pointer hover:bg-[#262626] "
              onClick={() => navigate(`/task/${encodeURIComponent(task.title)}`)}
            >
              <Table.RowHeaderCell className="px-4 py-2">
                <Badge
                  className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full 
                  }`}
                >
                  {task.status}
                </Badge>
              </Table.RowHeaderCell>
              <Table.Cell className="px-4 py-2 text-white">{task.title}</Table.Cell>
              <Table.Cell className="px-4 py-2 text-white">{task.difficulty}</Table.Cell>
              <Table.Cell className="px-4 py-2 text-white">{task.solution}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
  
  export default TasksTable;
  