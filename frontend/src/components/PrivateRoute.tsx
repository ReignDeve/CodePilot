// src/components/PrivateRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from 'contexts/AuthContext'

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}
