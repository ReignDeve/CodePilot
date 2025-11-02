import routes from '../utils/apiroutes.json'

export interface TaskDto {
  id: string
  title: string
  status: 'NotStarted' | 'InProgress' | 'Completed'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  code: string
  externalId: string
  description: string
  solution: string
}

export async function getTasks(): Promise<TaskDto[]> {
  const token = localStorage.getItem('jwt')
  if (!token) throw new Error('Kein Auth-Token gefunden')
  const url = routes.getAllTasks
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('jwt')
      window.location.replace('/login')
      return Promise.reject(new Error('Nicht autorisiert – bitte einloggen'))
    }
    throw new Error(await res.text())
  }
  return res.json()
}

export async function getTask(id: string): Promise<TaskDto> {
  const token = localStorage.getItem('jwt')
  if (!token) throw new Error('Kein Auth-Token gefunden')
  const url = routes.getTaskById.replace('{id}', id)
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function setTaskStatus(
  id: string,
  status: 'NotStarted' | 'InProgress' | 'Completed'
) {
  const token = localStorage.getItem('jwt')
  if (!token) throw new Error('Kein Auth-Token gefunden')
  console.log(status)
  const url = routes.updateTaskStatus.replace('{id}', id)
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error(await res.text())
}
