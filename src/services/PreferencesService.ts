/* eslint-disable @typescript-eslint/no-explicit-any */
import routes from '../utils/apiroutes.json'

export interface LearningPreferencesPayload {
  problemSolving: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  motivation: 'fun' | 'knowledge' | 'grades' | 'career' | ''
  motivationOther?: string
  learningStyle: 'examples' | 'trial' | 'tutorials' | 'discussion' | ''
  expectations: string
}

export async function saveLearningPreferences(
  payload: LearningPreferencesPayload
): Promise<void> {
  const token = localStorage.getItem('jwt')
  // Fallback auf feste URL, falls apiroutes-Eintrag fehlt
  const url =
    (routes as any).userPreferences ||
    'https://localhost:7277/api/users/me/preferences'

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Speichern der Lernpräferenzen fehlgeschlagen')
  }
}
