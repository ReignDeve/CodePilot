import axios from 'axios'

export type RunPayload = {
  taskId: string
  code: string
  language: string
  entryName?: string
  invocations?: string[]
  expectedOutput?: string
  endpoint?: string
}

export async function runTaskExecution(payload: RunPayload) {
  const {
    endpoint = 'http://localhost:8000/compile', // Default
    expectedOutput,
    ...body
  } = payload

  const response = await axios.post(endpoint, body)
  const output = String(
    response.data.output ?? response.data.stdout ?? ''
  ).trim()

  // einfacher Check
  const normalize = (s: string) => s.replace(/\s+/g, ' ').trim()
  const isCorrect = expectedOutput
    ? normalize(output) === normalize(expectedOutput)
    : false

  return { ...response.data, output, isCorrect, expectedOutput }
}
