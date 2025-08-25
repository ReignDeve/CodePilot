/* eslint-disable tailwindcss/no-custom-classname */
import React, { useState } from 'react'
import { saveLearningPreferences } from '../services/PreferencesService'

// Lokales State-Model passend zum Payload-Schema
interface LearningPreferencesState {
  problemSolving: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | ''
  motivation: 'fun' | 'knowledge' | 'grades' | 'career' | ''
  motivationOther: string
  learningStyle: 'examples' | 'trial' | 'tutorials' | 'discussion' | ''
  expectations: string
}

const LearningPreferencesCard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [preferences, setPreferences] = useState<LearningPreferencesState>({
    problemSolving: '',
    difficulty: '',
    motivation: '',
    motivationOther: '',
    learningStyle: '',
    expectations: ''
  })
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const totalSteps = 5

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep((s) => s + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }

  const handleFinish = async () => {
    setErrorMsg(null)
    setIsSubmitting(true)
    try {
      await saveLearningPreferences({
        problemSolving: preferences.problemSolving,
        difficulty: preferences.difficulty as
          | 'beginner'
          | 'intermediate'
          | 'advanced',
        motivation: preferences.motivation as
          | 'fun'
          | 'knowledge'
          | 'grades'
          | 'career'
          | '',
        motivationOther: preferences.motivationOther || undefined,
        learningStyle: preferences.learningStyle as
          | 'examples'
          | 'trial'
          | 'tutorials'
          | 'discussion'
          | '',
        expectations: preferences.expectations
      })
      // Nach Erfolg Popup schließen + Bestätigung anzeigen
      setIsPopupOpen(false)
      setCurrentStep(1)
      window.setTimeout(() => {
        window.alert('Lernpräferenzen wurden gespeichert.')
      }, 0)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Speichern fehlgeschlagen')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-foreground text-xl font-semibold">
              Wenn du beim Programmieren auf ein Problem stößt, wie gehst du
              typischerweise vor?
            </h3>
            <textarea
              value={preferences.problemSolving}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  problemSolving: e.target.value
                }))
              }
              placeholder="Beschreibe deine typische Vorgehensweise..."
              className="border-border bg-background text-foreground placeholder:text-muted-foreground h-32 w-full resize-none rounded-lg border px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-foreground text-xl font-semibold">
              Wie würdest du dein aktuelles Programmierlevel einschätzen?
            </h3>
            <div className="space-y-3">
              {[
                { value: 'beginner', label: 'Anfänger – kaum Erfahrung' },
                {
                  value: 'intermediate',
                  label:
                    'Fortgeschritten – kenne Grundlagen, brauche aber noch Hilfe'
                },
                {
                  value: 'advanced',
                  label: 'Erfahren – kann eigenständig Programme schreiben'
                }
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center space-x-3"
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={option.value}
                    checked={preferences.difficulty === (option.value as any)}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        difficulty: e.target.value as any
                      }))
                    }
                    className="text-blue-600 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-foreground text-xl font-semibold">
              Was motiviert dich am meisten beim Programmieren?
            </h3>
            <div className="space-y-3">
              {[
                { value: 'fun', label: 'Spaß am Problemlösen' },
                { value: 'knowledge', label: 'Neues Wissen / Skills erwerben' },
                {
                  value: 'grades',
                  label: 'Gute Noten / Zertifikate erreichen'
                },
                {
                  value: 'career',
                  label: 'Berufliche Karriere / Jobperspektive'
                }
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center space-x-3"
                >
                  <input
                    type="radio"
                    name="motivation"
                    value={option.value}
                    checked={preferences.motivation === (option.value as any)}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        motivation: e.target.value as any
                      }))
                    }
                    className="text-blue-600 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-foreground">{option.label}</span>
                </label>
              ))}

              {/* Freitext-Option */}
              <textarea
                value={preferences.motivationOther}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    motivationOther: e.target.value
                  }))
                }
                placeholder="Oder beschreibe deine eigene Motivation..."
                className="border-border bg-background text-foreground placeholder:text-muted-foreground h-20 w-full resize-none rounded-lg border px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-foreground text-xl font-semibold">
              Welche Lernform bevorzugst du, wenn du etwas Neues im
              Programmieren lernen möchtest?
            </h3>
            <div className="space-y-3">
              {[
                {
                  value: 'examples',
                  label: 'Durch Beispiele und fertigen Code'
                },
                {
                  value: 'trial',
                  label: 'Durch eigene Experimente / Trial & Error'
                },
                {
                  value: 'tutorials',
                  label: 'Durch schrittweise Erklärungen / Tutorials'
                },
                {
                  value: 'discussion',
                  label: 'Durch Diskussion mit anderen / Pair Programming'
                }
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center space-x-3"
                >
                  <input
                    type="radio"
                    name="learningStyle"
                    value={option.value}
                    checked={
                      preferences.learningStyle === (option.value as any)
                    }
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        learningStyle: e.target.value as any
                      }))
                    }
                    className="text-blue-600 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-foreground text-xl font-semibold">
              Was wünschst du dir persönlich von einem digitalen Lern-Tutor,
              damit er dich bestmöglich unterstützt?
            </h3>
            <textarea
              value={preferences.expectations}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  expectations: e.target.value
                }))
              }
              placeholder="Beschreibe hier deine Wünsche und Erwartungen..."
              className="border-border bg-background text-foreground placeholder:text-muted-foreground h-32 w-full resize-none rounded-lg border px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {/* Card Button */}
      <div
        onClick={() => setIsPopupOpen(true)}
        className="border-border group cursor-pointer rounded-lg border p-6 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-foreground mb-2 text-lg font-semibold transition-colors group-hover:text-blue-600">
              Lernpräferenzen
            </h3>
            <p className="text-muted-foreground text-sm">
              Personalisiere deine Lernerfahrung
            </p>
          </div>{' '}
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  p-4">
          <div className="border-border bg-foreground relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border  bg-white shadow-xl">
            {/* Header */}
            <div className="border-border flex items-center justify-between border-b p-6">
              <div>
                <h2 className="text-foreground text-2xl font-bold">
                  Lernpräferenzen
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Schritt {currentStep} von {totalSteps}
                </p>
              </div>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                disabled={isSubmitting}
              >
                <svg
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pt-4">
              <div className="bg-muted h-2 w-full rounded-full">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {errorMsg && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {errorMsg}
                </div>
              )}
              {renderStep()}
            </div>

            {/* Footer */}
            <div className="border-border flex items-center justify-between border-t p-6">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
                className="text-muted-foreground hover:text-foreground px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Zurück
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="text-muted-foreground hover:text-foreground px-4 py-2 transition-colors"
                  disabled={isSubmitting}
                >
                  Abbrechen
                </button>

                {currentStep < totalSteps ? (
                  <button
                    onClick={handleNext}
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Weiter
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="rounded-lg bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Speichern…' : 'Fertig'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LearningPreferencesCard
