import routes from '../utils/apiroutes.json'

export interface PilotRequest {
  text: string
}

export interface PilotResponse {
  data: string
}

/**
 * Sendet eine PilotRequest an den Backend-Endpunkt und gibt die Antwort zurück.
 * @param payload - Objekt mit Text und Frage
 * @returns Antwort-String vom Server
 * @throws Error, wenn der Request fehlschlägt
 */
export async function askPilot(taskId: string, code: string): Promise<string> {
  const token = localStorage.getItem('jwt')
  const url = routes.testrequest
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ taskId, code })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(
      `Request an ${url} fehlgeschlagen: ${response.status} ${response.statusText} - ${text}`
    )
  }

  // Antwort als Text (string) zurückliefern
  const result = await response.text()
  return result
}
