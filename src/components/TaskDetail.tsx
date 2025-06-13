import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import Description from './Description/Description'
import CodeEditor from './Editor'
import { askkh, askkm, askkr, askPilot } from 'services/QuestionService'
import { getTask, TaskDto } from 'services/TaskService'
import { Button } from '@radix-ui/themes'
import Markdown from 'react-markdown'
import { setTaskStatus } from 'services/TaskService'

const TaskDetail: React.FC = () => {
  const { id } = useParams() // <— ID statt title
  const [task, setTask] = useState<TaskDto | null>(null)
  const [code, setCode] = useState<string>()
  const [answer, setAnswer] = useState<string | null>(null)
  const [input, setInput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [asking, setAsking] = useState(false)
  const hasStartedRef = useRef(false)

  /* --------- Task vom Backend laden --------- */
  useEffect(() => {
    if (!id) return
    getTask(id)
      .then((t) => {
        setTask(t)
        setCode(t.code)
      })
      .catch((e) => setError(e.message))
  }, [id])

  /* --------- Pilot-Aufruf --------- */
  const handleSubmit = async () => {
    if (!task?.id || !code) {
      setAnswer('Task oder Code fehlt')
      return
    }
    try {
      setAnswer(await askPilot(task.id, code))
    } catch {
      setAnswer('Fehler beim Abruf')
    }
  }

  const handlekmSubmit = async () => {
    if (!task?.id || !code) {
      setAnswer('Task oder Code fehlt')
      return
    }
    try {
      setAnswer(await askkm(task.id, code))
    } catch {
      setAnswer('Fehler beim Abruf')
    }
  }

  const handlekrSubmit = async () => {
    if (!task?.id || !code) {
      setAnswer('Task oder Code fehlt')
      return
    }
    try {
      setAnswer(await askkr(task.id, code))
    } catch {
      setAnswer('Fehler beim Abruf')
    }
  }
  const handlekhSubmit = async () => {
    if (!task?.id || !code) {
      setAnswer('Task oder Code fehlt')
      return
    }
    try {
      setAnswer(await askkh(task.id, code))
    } catch {
      setAnswer('Fehler beim Abruf')
    }
  }

  const handleCodeChange = async (newCode: string) => {
    setCode(newCode)

    // ② Bei allererstem Tipp: Status wechseln
    if (!hasStartedRef.current && task?.status === 'NotStarted') {
      hasStartedRef.current = true
      try {
        await setTaskStatus(task.id, 'InProgress')
        setTask((prev) => (prev ? { ...prev, status: 'InProgress' } : prev)) // UI-Refresh
      } catch (e) {
        console.error(e)
      }
    }
  }

  /* --------- UI --------- */
  if (error) return <p className="text-red-500">{error}</p>
  if (!task) return <p className="text-white">Lade Task…</p>

  return (
    <div className="flex h-full flex-col overflow-hidden rounded p-2 text-white">
      <PanelGroup
        direction="horizontal"
        className="flex h-full flex-1 overflow-hidden"
      >
        {/* Description */}
        <Panel
          defaultSize={10}
          className="h-full overflow-y-auto rounded bg-[#ffffff1a] shadow"
        >
          <h2 className="mb-2 pl-2 pt-2 text-xl font-semibold">Description</h2>

          <div className="size-full rounded bg-[#262626] pl-4">
            <h2 className="my-3 text-xl font-semibold">{task.title}</h2>
            <Description description={task.description} />
          </div>
        </Panel>

        <PanelResizeHandle className="w-2 cursor-col-resize" />

        {/* Code + AI */}
        <PanelGroup
          direction="vertical"
          className="flex h-full flex-1 overflow-hidden"
        >
          <Panel
            defaultSize={70}
            minSize={20}
            className="flex flex-col overflow-hidden rounded bg-[#ffffff1a] shadow"
          >
            <h2 className="mb-2 pl-2 pt-2 text-xl font-semibold text-white">
              Code
            </h2>
            <div className="size-full rounded bg-[#262626]">
              <CodeEditor value={code} onChange={handleCodeChange} />
            </div>
          </Panel>

          <PanelResizeHandle className="h-2 cursor-row-resize" />

          <Panel
            defaultSize={30}
            minSize={10}
            className="overflow-auto rounded bg-[#ffffff1a] shadow"
          >
            <h2 className="mb-2 pl-2 pt-2 text-xl font-semibold">AI Tutor</h2>
            <div className="size-full rounded bg-[#262626] p-2">
              <div className="flex items-center gap-2">
                {asking ? (
                  <div className="m-2 flex  w-full flex-row items-center rounded bg-[#1a1a1a] p-2 text-white">
                    <div className="w-full">
                      <input
                        className="m-2 w-full flex-1 border-none bg-[#1a1a1a] p-2 text-white outline-none"
                        type="text"
                        placeholder="Ask a question..."
                        autoFocus
                        maxLength={200}
                        value={input ?? ''}
                        onChange={(e) => setInput(e.target.value)}
                        onBlur={() => setAsking(false)}
                      />
                    </div>
                    <div className="flex items-center  gap-2">
                      <span className="text-xs text-gray-400">
                        {200 - (input?.length ?? 0)} / 200
                      </span>
                      <Button
                        className={`m-2 ${
                          !input || input.length === 0
                            ? 'cursor-not-allowed bg-gray-700 text-gray-400'
                            : ''
                        }`}
                        disabled={!input || input.length === 0}
                        style={
                          !input || input.length === 0
                            ? {
                                backgroundColor: '#444',
                                color: '#bbb',
                                opacity: 1
                              }
                            : undefined
                        }
                        onClick={async () => {
                          if (!input || !task?.id || !code) return
                          setAnswer(null)
                          setAsking(false)
                          try {
                            // setAnswer(await askPilot(task.id, code, input))
                          } catch {
                            setAnswer('Fehler beim Abruf')
                          }
                        }}
                      >
                        Senden
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button className="m-2" onClick={handleSubmit}>
                      Überprüfen Lassen
                    </Button>
                    <Button className="m-2" onClick={handlekhSubmit}>
                      KH Feedback
                    </Button>
                    <Button className="m-2" onClick={handlekmSubmit}>
                      KM Feedback
                    </Button>
                    <Button className="m-2" onClick={handlekrSubmit}>
                      KR Feedback
                    </Button>
                    <Button className="m-2" onClick={() => setAsking(true)}>
                      Ask a Question
                    </Button>
                  </>
                )}
              </div>
              {answer && (
                <pre className="mt-4 whitespace-pre-wrap rounded bg-[#ffffff1a] p-2 text-white">
                  <Markdown>{answer}</Markdown>
                </pre>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </PanelGroup>
    </div>
  )
}

export default TaskDetail
