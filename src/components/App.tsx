import Avatar from 'components/Avatar'
import logo from 'assets/logo.svg'
import { Flex, Text, Button } from "@radix-ui/themes";
import TasksTable from './Table';
import { BrowserRouter, Route, Routes } from 'react-router';
import TaskDetail from './TaskDetail';

const randoms = [
  [1, 2],
  [3, 4, 5],
  [6, 7]
]

function App() {
  return (
    <BrowserRouter>
    <Flex direction="column" gap="2">
			<Text className='text-center  text-3xl'>CodePilot</Text>
    <Routes>
    <Route path="/" element={<TasksTable />} />
    <Route path="/task/:title" element={<TaskDetail />} />
    </Routes>
		</Flex>
    </BrowserRouter>
  )
}

export default App
