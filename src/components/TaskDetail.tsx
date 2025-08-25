import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import Description from './Description/Description'
import CodeEditor from './Editor'
import { askkh, askkm, askkr, askPilot } from 'services/QuestionService'
import { getTask, TaskDto } from 'services/TaskService'
import { Button, IconButton, Skeleton, Tabs } from '@radix-ui/themes'
import Markdown from 'react-markdown'
import { setTaskStatus } from 'services/TaskService'
import {
  EnterFullScreenIcon,
  LockClosedIcon,
  PlayIcon,
  UploadIcon
} from '@radix-ui/react-icons'

const TaskDetail: React.FC = () => {
  const { id } = useParams() // <— ID statt title
  const [task, setTask] = useState<TaskDto | null>(null)
  const [code, setCode] = useState<string>()
  const [answer, setAnswer] = useState<string | null>(null)
  const [input, setInput] = useState<string>()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [asking, setAsking] = useState(false)
  const hasStartedRef = useRef(false)

  const [hLayout, setHLayout] = useState<number[]>([50, 50])

  /* ► vertikale Gruppe rechts: [code, ai] */
  const [vLayout, setVLayout] = useState<number[]>([70, 30])

  /* ► Fullscreen‑Toggle + Backup der zuvor gemerkten Layouts */
  const [fullscreen, setFullscreen] = useState(false)
  const [saved, setSaved] = useState<{ h: number[]; v: number[] } | null>(null)

  const toggleFullscreen = () => {
    if (!fullscreen) {
      // ► merken & maximieren
      setSaved({ h: hLayout, v: vLayout })
      setHLayout([0, 100]) // linkes Panel ausblenden
      setVLayout([100, 0]) // AI‑Pane ausblenden
      setFullscreen(true)
    } else if (saved) {
      // ► vorherige Verteilung zurückholen
      setHLayout(saved.h)
      setVLayout(saved.v)
      setFullscreen(false)
    }
  }

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
    setIsLoading(true)
    if (!task?.id || !code) {
      setAnswer('Task oder Code fehlt')
      return
    }
    try {
      setAnswer(await askPilot(task.id, code))
    } catch {
      setAnswer('Fehler beim Abruf')
    } finally {
      setIsLoading(false)
    }
  }

  const handlekmSubmit = async () => {
    setIsLoading(true)
    if (!task?.id || !code) {
      setAnswer('Task oder Code fehlt')
      return
    }
    try {
      setAnswer(await askkm(task.id, code))
    } catch {
      setAnswer('Fehler beim Abruf')
    } finally {
      setIsLoading(false)
    }
  }

  const handlekrSubmit = async () => {
    setIsLoading(true)
    if (!task?.id || !code) {
      setAnswer('Task oder Code fehlt')
      return
    }
    try {
      setAnswer(await askkr(task.id, code))
    } catch {
      setAnswer('Fehler beim Abruf')
    } finally {
      setIsLoading(false)
    }
  }
  const handlekhSubmit = async () => {
    setIsLoading(true)
    if (!task?.id || !code) {
      setAnswer('Task oder Code fehlt')
      return
    }
    try {
      setAnswer(await askkh(task.id, code))
    } catch {
      setAnswer('Fehler beim Abruf')
    } finally {
      setIsLoading(false)
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
  if (error) return <p className="text-red-500">{error}</p>
  if (!task) return <p className="text-white">Lade Task…</p>

  return (
    <div className="-mt-12 h-full">
      <div>
        <section className="mx-auto mt-[-5] flex w-1/2 justify-center gap-2 pr-2">
          <Button className="cursor-pointer">
            <PlayIcon />
          </Button>
          <Button className="cursor-pointer">
            <UploadIcon />
            Submit
          </Button>
        </section>
      </div>
      <div className="flex h-full flex-col overflow-hidden rounded p-2">
        <PanelGroup
          direction="horizontal"
          className="flex h-full flex-1 overflow-hidden"
          layout={hLayout}
          onLayout={setHLayout}
        >
          {/* Left panel: Tabs for description / solution */}
          <Panel
            defaultSize={50}
            minSize={5}
            className="h-full overflow-hidden rounded shadow"
          >
            <Tabs.Root
              defaultValue="description"
              className="flex h-full flex-col"
            >
              {/* Tab triggers */}
              <Tabs.List className="flex shrink-0 border-b border-gray-200 dark:border-white/10">
                <Tabs.Trigger
                  value="description"
                  className="px-3 py-2 text-sm font-medium focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  Description
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="solution"
                  className="px-3 py-2 text-sm font-medium focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                  disabled
                >
                  <LockClosedIcon className="mr-2" />
                  Solution
                </Tabs.Trigger>
              </Tabs.List>

              {/* Description tab content */}
              <Tabs.Content
                value="description"
                className="flex-1 overflow-y-auto p-4"
              >
                <h2 className="mb-2 text-xl font-semibold">Beschreibung</h2>
                <h3 className="my-3 text-lg font-semibold">{task.title}</h3>
                <Description description={task.description} />
              </Tabs.Content>

              {/* Solution tab content */}
              <Tabs.Content
                value="solution"
                className="flex-1 overflow-y-auto p-4"
              >
                <h2 className="mb-2 text-xl font-semibold">Lösung</h2>
                {task.solution ? (
                  <Markdown>{task.solution}</Markdown>
                ) : (
                  <p className="italic text-gray-500">
                    Noch keine Lösung eingereicht.
                  </p>
                )}
              </Tabs.Content>
            </Tabs.Root>
          </Panel>
          <PanelResizeHandle className="w-2 cursor-col-resize" />
          <Panel>
            {/* Right‑hand side: Code editor + AI tutor */}
            <PanelGroup
              direction="vertical"
              className="flex h-full flex-1 overflow-hidden"
            >
              {/* Code editor */}
              <Panel
                minSize={20}
                className="flex flex-col overflow-hidden rounded shadow"
              >
                {/* Kopfzeile */}
                <div className="flex items-center justify-between p-2">
                  <h2 className="text-xl font-semibold">Code</h2>
                  <IconButton variant="ghost" onClick={toggleFullscreen}>
                    <EnterFullScreenIcon />
                  </IconButton>
                </div>

                {/* Editor‑Container: nimmt immer die restliche Höhe ein */}
                <div className="flex-1 overflow-hidden">
                  <CodeEditor value={code} onChange={handleCodeChange} />
                </div>
              </Panel>
              <PanelResizeHandle className="h-2 cursor-row-resize" />

              {/* AI Tutor */}
              <Panel
                defaultSize={30}
                minSize={10}
                className="overflow-auto rounded shadow"
              >
                <h2 className="mb-2 pl-2 pt-2 text-xl font-semibold">
                  AI Tutor
                </h2>
                <div className="size-full rounded p-2">
                  {/* Controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    {asking ? (
                      <div className="m-2 flex w-full flex-row items-center rounded p-2 ">
                        <input
                          className="m-2 w-full flex-1 p-2 outline-none"
                          type="text"
                          placeholder="Ask anything about the task…"
                          autoFocus
                          maxLength={200}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onBlur={() => setAsking(false)}
                        />
                        {input ? (
                          <div>
                            <span className="text-xs">
                              {200 - input.length} / 200
                            </span>
                            <Button
                              size="2"
                              disabled={input.length === 0}
                              onClick={async () => {
                                if (!input || !task?.id || !code) return
                                setAnswer(null)
                                setAsking(false)
                                // await safeAsk((id, c) => askPilot(id, c, input));
                              }}
                            >
                              Senden
                            </Button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    ) : (
                      <>
                        <Button className="m-2" onClick={handleSubmit}>
                          Überprüfen lassen
                        </Button>
                        <Button className="m-2" onClick={handlekhSubmit}>
                          KH Feedback
                        </Button>
                        <Button className="m-2" onClick={handlekmSubmit}>
                          KM Feedback
                        </Button>
                        <Button className="m-2" onClick={handlekrSubmit}>
                          KR Feedback
                        </Button>
                        <Button className="m-2" onClick={() => setAsking(true)}>
                          Ask a Question
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Answer */}
                  {isLoading ? (
                    <div className="mt-4 h-16 w-full animate-pulse rounded bg-gradient-to-r from-transparent via-gray-300/20 to-transparent dark:via-white/10" />
                  ) : answer ? (
                    <pre className="mt-4 max-h-60 overflow-y-auto whitespace-pre-wrap rounded p-2">
                      <Markdown>{answer}</Markdown>
                    </pre>
                  ) : null}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}

export default TaskDetail
