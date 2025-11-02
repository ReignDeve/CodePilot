/* eslint-disable prettier/prettier */
// src/pages/LoginPage.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'contexts/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { loginUser, registerUser } = useAuth()
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    localStorage.clear();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (isRegister) {
        await registerUser({ userName, password })
      } else {
        await loginUser({ userName, password })
      }
      navigate('/')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 rounded p-6 shadow-lg">
        <h2 className="text-center text-2xl font-bold">
          {isRegister ? 'Register' : 'Login'}
        </h2>
        {error && <p className="text-red-400">Username or Password is incorrect. Please try again.</p>}
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full rounded border px-3 py-2 text-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border px-3 py-2 text-black"
          required
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
        <p className="text-center text-sm">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-400 underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </form>
    </div>
  )
}
