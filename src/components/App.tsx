import { Flex, Theme } from '@radix-ui/themes'
import TasksTable from './Table'
import { BrowserRouter, Route, Routes } from 'react-router'
import TaskDetail from './TaskDetail'
import Navigation from './Navbar'
import { AuthProvider } from 'contexts/AuthContext'
import LoginPage from 'Pages/LoginPage'
import { PrivateRoute } from './PrivateRoute'
import { useEffect, useState } from 'react'
import '@radix-ui/themes/styles.css'

function App() {
  const [appearance, setAppearance] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('appearance') as 'light' | 'dark' | null
    if (stored) setAppearance(stored)
  }, [])
  const toggleAppearance = () => {
    const next = appearance === 'light' ? 'dark' : 'light'
    setAppearance(next)
    localStorage.setItem('appearance', next)
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Theme appearance={appearance} accentColor="blue" grayColor="auto">
          <Flex direction="column" className="h-screen" gap="2">
            <Navigation
              appearance={appearance}
              onToggleAppearance={toggleAppearance}
            />
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
        </Theme>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
