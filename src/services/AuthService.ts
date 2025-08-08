import routes from '../utils/apiroutes.json'

// src/services/authService.ts
export interface LoginDto {
  userName: string
  password: string
}

export interface RegisterDto {
  userName: string
  password: string
}

export async function login(dto: LoginDto): Promise<string> {
  const url = routes.authLogin
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Login failed')
  }
  return res.text() // JWT-Token
}

export async function register(dto: RegisterDto): Promise<void> {
  const url = routes.authRegister
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Registration failed')
  }
}

