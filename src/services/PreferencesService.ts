/* eslint-disable @typescript-eslint/no-explicit-any */
import { MotivationValue } from 'components/LearningPreferencesCard'
import routes from '../utils/apiroutes.json'

export interface LearningPreferencesPayload {
  problemSolving: string
  difficulty: string
  problems: string
  motivation: MotivationValue[]
  motivationOther?: string
  learningStyle: string
  moreLearningStyle?: string
  expectations: string
}

export async function saveLearningPreferences(
  payload: LearningPreferencesPayload
): Promise<void> {
  const token = localStorage.getItem('jwt')
  const url = routes.userPreferences
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  console.log(response)
}
