import { Flex } from '@radix-ui/themes'
import TasksTable from './Table'
import { BrowserRouter, Route, Routes } from 'react-router'
import TaskDetail from './TaskDetail'
import Navigation from './Navbar'
import { AuthProvider } from 'contexts/AuthContext'
import LoginPage from 'Pages/LoginPage'
import { PrivateRoute } from './PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Flex direction="column" className="h-screen bg-[#1a1a1a]" gap="2">
          <Navigation />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <TasksTable />
                </PrivateRoute>
              }
            />
            <Route
              path="/task/:id"
              element={
                <PrivateRoute>
                  <TaskDetail />
                </PrivateRoute>
              }
            />
          </Routes>
        </Flex>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
