/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable tailwindcss/no-custom-classname */
import React, { useState } from 'react'
import { saveLearningPreferences } from '../services/PreferencesService'
import {
  Dialog,
  Button,
  Flex,
  Text,
  TextArea,
  RadioGroup,
  Callout,
  Progress,
  Separator,
  CheckboxGroup
} from '@radix-ui/themes'

export type MotivationValue = '' | 'fun' | 'knowledge' | 'grades' | 'career'
export type DifficultyValue = 'beginner' | 'intermediate' | 'advanced' | ''
export type LearningStyleValue =
  | ''
  | 'examples'
  | 'trial'
  | 'tutorials'
  | 'discussion'
const LearningStyleVerbose: Record<Exclude<LearningStyleValue, ''>, string> = {
  examples:
    'Beispielbasiert: Ich lerne am besten durch gut kommentierte Worked Examples mit Schritt-für-Schritt-Erklärungen.',
  trial:
    'Explorativ: Ich probiere Dinge selbst aus, iteriere schnell und lerne aus Fehlern (Trial-and-Error).',
  tutorials:
    'Geführt: Klare Schritt-für-Schritt-Anleitungen, strukturierte Übungen und Checklisten helfen mir am meisten.',
  discussion:
    'Sozial: Austausch, Fragen stellen und Erklären in eigenen Worten (Pairing/Code-Reviews) bringt mich am weitesten.'
}

const DifficultyVerbose: Record<Exclude<DifficultyValue, ''>, string> = {
  beginner: 'Ich bin Anfänger.',
  intermediate: 'Ich bin fortgeschritten.',
  advanced: 'Ich bin erfahren.'
}
interface LearningPreferencesState {
  problemSolving: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | ''
  problems: string
  motivation: MotivationValue[]
  motivationOther: string
  learningStyle: LearningStyleValue
  moreLearningStyle: string
  expectations: string
}

const LearningPreferencesCard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [preferences, setPreferences] = useState<LearningPreferencesState>({
    problemSolving: '',
    difficulty: '',
    problems: '',
    motivation: [],
    motivationOther: '',
    learningStyle: '',
    moreLearningStyle: '',
    expectations: ''
  })
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const totalSteps = 7
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep((s) => s + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }

  const handleFinish = async () => {
    setErrorMsg(null)
    setIsSubmitting(true)
    const verboseLearningStyle = preferences.learningStyle
      ? LearningStyleVerbose[
          preferences.learningStyle as Exclude<LearningStyleValue, ''>
        ]
      : ''

    const verboseDifficulty = preferences.difficulty
      ? DifficultyVerbose[
          preferences.difficulty as Exclude<DifficultyValue, ''>
        ]
      : ''
    try {
      await saveLearningPreferences({
        problemSolving: preferences.problemSolving,
        difficulty: verboseDifficulty,
        problems: preferences.problems,
        motivation: preferences.motivation,
        motivationOther: preferences.motivationOther || undefined,
        learningStyle: verboseLearningStyle,
        moreLearningStyle: preferences.moreLearningStyle || undefined,
        expectations: preferences.expectations
      })
      setIsPopupOpen(false)
      setCurrentStep(1)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Speichern fehlgeschlagen')
    } finally {
      setIsSubmitting(false)
    }
  }

  const Step1 = (
    <Flex direction="column" gap="3">
      <Text as="p" size="4" weight="bold">
        Hallo! Damit du optimal unterstützt werden kannst, kannst du hier deine
        Lernpräferenzen angeben.
      </Text>

      <Text as="p" size="3">
        Deine Antworten helfen, Inhalte, Erklärungen und Übungsaufgaben besser
        auf dich zuzuschneiden – damit du schneller verstehst, was wichtig ist,
        und gezielter üben kannst.
      </Text>

      <Text as="p" size="3">
        Die Antworten werden durch ein LLM zusammengefasst und zu einem Prompt
        umformuliert. Dieser Prompt wird dann als Kontext für das Feedback
        verwendet. So kann das Feedback besser auf dich abgestimmt werden.
      </Text>

      <Text as="p" size="3" weight="bold" className="mt-2">
        Was du noch wissen solltest:
      </Text>

      <ul className="list-disc space-y-2 pl-5 text-sm md:text-base">
        <li>
          <span className="font-medium">Dauer:</span> Das Ausfüllen dauert nur
          wenige Minuten – du kannst jederzeit pausieren und später
          weitermachen.
        </li>
        <li>
          <span className="font-medium">Änderbar:</span> Du kannst deine
          Präferenzen hier jederzeit anpassen. Die Änderungen werden sofort
          übernommen.
        </li>
        <li>
          <span className="font-medium">Transparenz:</span> Deine Angaben werden
          ausschließlich verwendet, um dein Lernerlebnis zu personalisieren
          (Aufgabenauswahl, Hinweise, Beispiele, Fortschrittsempfehlungen).
        </li>
      </ul>
    </Flex>
  )

  const Step2 = (
    <Flex direction="column" gap="3">
      <Text as="p" size="4" weight="bold">
        Was sind deine typischen Probleme oder Herausforderungen beim
        Programmieren?
      </Text>
      <TextArea
        value={preferences.problems}
        onChange={(e) =>
          setPreferences((prev) => ({
            ...prev,
            problems: e.target.value
          }))
        }
        placeholder="Beschreibe deine typischen Probleme..."
        rows={6}
        disabled={isSubmitting}
      />
    </Flex>
  )

  const Step3 = (
    <Flex direction="column" gap="3">
      <Text as="p" size="4" weight="bold">
        Wenn du beim Programmieren auf ein Problem stößt, wie gehst du
        typischerweise vor?
      </Text>
      <TextArea
        value={preferences.problemSolving}
        onChange={(e) =>
          setPreferences((prev) => ({
            ...prev,
            problemSolving: e.target.value
          }))
        }
        placeholder="Beschreibe deine typische Vorgehensweise..."
        rows={6}
        disabled={isSubmitting}
      />
    </Flex>
  )

  const Step4 = (
    <Flex direction="column" gap="3">
      <Text as="p" size="4" weight="bold">
        Wie würdest du dein aktuelles Programmierlevel einschätzen?
      </Text>
      <RadioGroup.Root
        value={preferences.difficulty}
        onValueChange={(value) =>
          setPreferences((prev) => ({ ...prev, difficulty: value as any }))
        }
        disabled={isSubmitting}
      >
        <Flex direction="column" gap="2">
          <RadioGroup.Item value="beginner">
            Anfänger – starte gerade, wenig/keine Praxis
          </RadioGroup.Item>
          <RadioGroup.Item value="intermediate">
            Fortgeschritten – kenne Grundlagen, löse einfache Aufgaben
          </RadioGroup.Item>
          <RadioGroup.Item value="advanced">
            Erfahren – strukturiere Projekte, debugge und teste selbstständig
          </RadioGroup.Item>
        </Flex>
      </RadioGroup.Root>
    </Flex>
  )

  const Step5 = (
    <Flex direction="column" gap="3">
      <Text as="p" size="4" weight="bold">
        Was motiviert dich am meisten beim Programmieren?
      </Text>
      <CheckboxGroup.Root
        value={preferences.motivation}
        onValueChange={(value) =>
          setPreferences((prev) => ({
            ...prev,
            motivation: value as MotivationValue[]
          }))
        }
        disabled={isSubmitting}
      >
        <Flex direction="column" gap="2">
          <CheckboxGroup.Item value="fun">
            Spaß am Problemlösen
          </CheckboxGroup.Item>
          <CheckboxGroup.Item value="knowledge">
            Neues Wissen / Skills erwerben
          </CheckboxGroup.Item>
          <CheckboxGroup.Item value="grades">
            Gute Noten / Zertifikate erreichen
          </CheckboxGroup.Item>
          <CheckboxGroup.Item value="career">
            Berufliche Karriere / Jobperspektive
          </CheckboxGroup.Item>
        </Flex>
      </CheckboxGroup.Root>

      <Text as="label" size="2" weight="bold">
        Andere Motivation
      </Text>
      <TextArea
        value={preferences.motivationOther}
        onChange={(e) =>
          setPreferences((prev) => ({
            ...prev,
            motivationOther: e.target.value
          }))
        }
        placeholder="Oder beschreibe deine eigene Motivation..."
        rows={4}
        disabled={isSubmitting}
      />
    </Flex>
  )

  const Step6 = (
    <Flex direction="column" gap="3">
      <Text as="p" size="4" weight="bold">
        Welche Lernform bevorzugst du, wenn du etwas Neues im Programmieren
        lernen möchtest?
      </Text>
      <RadioGroup.Root
        value={preferences.learningStyle}
        onValueChange={(value) =>
          setPreferences((prev) => ({ ...prev, learningStyle: value as any }))
        }
        disabled={isSubmitting}
      >
        <Flex direction="column" gap="2">
          <RadioGroup.Item value="examples">
            Durch Beispiele und fertigen Code
          </RadioGroup.Item>
          <RadioGroup.Item value="trial">
            Durch eigene Experimente / Trial &amp; Error
          </RadioGroup.Item>
          <RadioGroup.Item value="tutorials">
            Durch schrittweise Erklärungen / Tutorials
          </RadioGroup.Item>
          <RadioGroup.Item value="discussion">
            Durch Diskussion mit anderen / Pair Programming
          </RadioGroup.Item>
        </Flex>
      </RadioGroup.Root>
      <Text as="label" size="2" weight="bold">
        Weitere Lernformen oder Lernmethoden
      </Text>
      <TextArea
        value={preferences.moreLearningStyle}
        onChange={(e) =>
          setPreferences((prev) => ({
            ...prev,
            moreLearningStyle: e.target.value
          }))
        }
        placeholder="Oder beschreibe deine eigene Lernmethode..."
        rows={4}
        disabled={isSubmitting}
      />
    </Flex>
  )

  const Step7 = (
    <Flex direction="column" gap="3">
      <Text as="p" size="4" weight="bold">
        Gibt es noch etwas, das dir wichtig ist oder das du hinzufügen möchtest?
      </Text>
      <TextArea
        value={preferences.expectations}
        onChange={(e) =>
          setPreferences((prev) => ({ ...prev, expectations: e.target.value }))
        }
        placeholder="Beschreibe hier deine Wünsche, Anmerkungen oder Erwartungen..."
        rows={6}
        disabled={isSubmitting}
      />
    </Flex>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return Step1
      case 2:
        return Step2
      case 3:
        return Step3
      case 4:
        return Step4
      case 5:
        return Step5
      case 6:
        return Step6
      case 7:
        return Step7
      default:
        return null
    }
  }

  return (
    <>
      <Dialog.Root
        open={isPopupOpen}
        onOpenChange={(open) => {
          // Während des Speicherns nicht schließen
          if (!isSubmitting) setIsPopupOpen(open)
        }}
      >
        <Dialog.Trigger>
          {/* Card Button (behält dein bestehendes Tailwind-Design) */}
          <div className="border-border group cursor-pointer rounded-lg border p-6 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground mb-2 text-lg font-semibold transition-colors group-hover:text-blue-600">
                  Lernpräferenzen
                </h3>
                <p className="text-muted-foreground text-md">
                  Personalisiere deine Lernerfahrung
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Dadurch kann das System dich und deine Lernweise besser
                  verstehen und sich so dir anzupassen.
                </p>
              </div>
            </div>
          </div>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="720px">
          <Flex justify="between" align="center" mb="2">
            <div>
              <Dialog.Title>Lernpräferenzen</Dialog.Title>
              <Text size="2" color="gray">
                Schritt {currentStep} von {totalSteps}
              </Text>
            </div>
            {/* Schließen-Button oben rechts */}
            <Dialog.Close disabled={isSubmitting}>
              <Button variant="soft" color="gray" disabled={isSubmitting}>
                Schließen
              </Button>
            </Dialog.Close>
          </Flex>

          <Progress value={progress} mb="3" />
          <Separator my="3" />

          {errorMsg && (
            <Callout.Root color="red" mb="3">
              <Callout.Text>{errorMsg}</Callout.Text>
            </Callout.Root>
          )}

          {renderStep()}

          <Flex justify="between" align="center" mt="4">
            <Button
              variant="soft"
              color="gray"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
            >
              Zurück
            </Button>

            <Flex gap="3">
              <Dialog.Close disabled={isSubmitting}>
                <Button variant="soft" color="gray" disabled={isSubmitting}>
                  Abbrechen
                </Button>
              </Dialog.Close>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext} disabled={isSubmitting}>
                  Weiter
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  color="green"
                >
                  {isSubmitting ? 'Speichern…' : 'Fertig'}
                </Button>
              )}
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

export default LearningPreferencesCard
