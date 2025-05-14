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
export async function askPilot(payload: PilotRequest): Promise<string> {
  const url = routes.testrequest // Pfad aus apiroute.json, z.B. { "test": "http://localhost:5000/Test" }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
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
