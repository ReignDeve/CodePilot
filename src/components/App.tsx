import Avatar from 'components/Avatar'
import logo from 'assets/logo.svg'
import { Flex, Text, Button } from "@radix-ui/themes";
import TasksTable from './Table';
import { BrowserRouter, Route, Routes } from 'react-router';
import TaskDetail from './TaskDetail'
import Navigation from './Navbar';

function App() {
  return (
    <BrowserRouter>
    <Flex direction="column" className='bg-[#1a1a1a] h-screen' gap="2">
			<Navigation/>
    <Routes>
    <Route path="/" element={<TasksTable />} />
    <Route path="/task/:title" element={<TaskDetail />} />
    </Routes>
		</Flex>
    </BrowserRouter>
  )
}

export default App
