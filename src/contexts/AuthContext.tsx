// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { login, register, LoginDto, RegisterDto } from 'services/AuthService'

interface AuthContextType {
  token: string | null
  userName: string | null
  loginUser: (credentials: LoginDto) => Promise<void>
  registerUser: (credentials: RegisterDto) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('jwt')
  )
  const [userName, setUserName] = useState<string | null>(() =>
    localStorage.getItem('userName')
  )

  const loginUser = async (creds: LoginDto) => {
    const tok = await login(creds)
    localStorage.setItem('jwt', tok)
    localStorage.setItem('userName', creds.userName)
    setToken(tok)
    setUserName(creds.userName)
  }

  const registerUser = async (creds: RegisterDto) => {
    await register(creds)
    // nach Registration direkt einloggen
    await loginUser({ userName: creds.userName, password: creds.password })
  }

  const logout = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('userName')
    setToken(null)
    setUserName(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, userName, loginUser, registerUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
