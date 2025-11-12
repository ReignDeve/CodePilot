import routes from '../utils/apiroutes.json'
// src/services/RunService.ts
import axios from 'axios'

export interface RunPayload {
  taskId: string
  code: string
  language: string
}

export async function runCode(payload: RunPayload) {
  const response = await axios.post(routes.compileCode, payload)
  console.log('Compile response:', response.data)
  return response.data
}
