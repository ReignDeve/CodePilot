/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable no-irregular-whitespace */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'
import Description from './Description/Description'
import CodeEditor from './Editor'
import {
  askkh,
  askkm,
  askkr,
  askPilot,
  askGeneral
} from 'services/QuestionService'
import { getTask, TaskDto, setTaskStatus } from 'services/TaskService'
import { Button, IconButton, Tabs } from '@radix-ui/themes'
import ReactMarkdown from 'react-markdown'
import { useTaskExecution } from 'contexts/TaskExecutionContext'
import {
  EnterFullScreenIcon,
  LockClosedIcon,
  ArrowUpIcon,
  CodeIcon,
  ReaderIcon,
  ChatBubbleIcon
} from '@radix-ui/react-icons'
import Lection from './Lection/Lection'

import { Mosaic, MosaicNode, MosaicWindow } from 'react-mosaic-component'
import 'react-mosaic-component/react-mosaic-component.css'
import '../assets/mosaic-override.css'

type TileId = 'left' | 'code' | 'ai'
type Node = MosaicNode<TileId>

const STORAGE_KEY = 'taskdetail-mosaic'

function loadTree(): Node | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Node) : null
  } catch {
    return null
  }
}
function saveTree(tree: Node | null) {
  try {
    if (tree) localStorage.setItem(STORAGE_KEY, JSON.stringify(tree))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

const TaskDetail: React.FC = () => {
  const { id } = useParams()
  const [task, setTask] = useState<TaskDto | null>(null)
  const [code, setCode] = useState<string>()
  const { updateExecutionData, isCompiled } = useTaskExecution()
  const [answer, setAnswer] = useState<string | null>(null)
  const [input, setInput] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const hasStartedRef = useRef(false)

  // Linkes Panel: Radix Tabs Zustand
  type LeftTab = 'description' | 'lection' | 'solution'
  const [leftTab, setLeftTab] = useState<LeftTab>('description')

  // --- Mosaic Layout
  const initialTree: Node = useMemo<Node>(() => {
    const saved = loadTree()
    if (saved) return saved
    return {
      direction: 'row',
      splitPercentage: 50,
      first: 'left',
      second: {
        direction: 'column',
        splitPercentage: 70,
        first: 'code',
        second: 'ai'
      } as MosaicNode<TileId>
    }
  }, [])
  const [mosaicTree, setMosaicTree] = useState<Node>(() => initialTree)

  // --- Fullscreen (nur Code zeigen)

  /* --------- Task laden --------- */
  useEffect(() => {
    if (!id) return
    getTask(id)
      .then((t) => {
        setTask(t)
        setCode(t.code)
        updateExecutionData({ taskId: t.id ?? null, code: t.code })
      })
      .catch((e) => setError(e.message))
  }, [id, updateExecutionData])

  function statusUpdater() {
    if (task?.status === 'NotStarted') return true
    return false
  }

  /* --------- Pilot-/Feedback-Aufrufe --------- */
  const handleSubmit = async () => {
    setIsLoading(true)
    if (statusUpdater()) {
      setTaskStatus(task!.id, 'InProgress')
    }
    if (!task?.id || !code) {
      setAnswer('Task oder Code fehlt')
      setIsLoading(false)
      return
    }
    try {
      setAnswer(await askGeneral(task.id, code))
    } catch {
      setAnswer('Fehler beim Abruf')
    } finally {
      setIsLoading(false)
    }
  }
  const handlekmSubmit = async () => {
    setIsLoading(true)
    if (statusUpdater()) {
      setTaskStatus(task!.id, 'InProgress')
    }
    if (!task?.id || !code) {
      setAnswer('Task oder Code fehlt')
      setIsLoading(false)
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
    if (statusUpdater()) {
      setTaskStatus(task!.id, 'InProgress')
    }
    if (!task?.id || !code) {
      setAnswer('Task oder Code fehlt')
      setIsLoading(false)
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
    if (statusUpdater()) {
      setTaskStatus(task!.id, 'InProgress')
    }
    if (!task?.id || !code) {
      setAnswer('Task oder Code fehlt')
      setIsLoading(false)
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
    updateExecutionData({ code: newCode })
    if (!hasStartedRef.current && task?.status === 'NotStarted') {
      hasStartedRef.current = true
      try {
        await setTaskStatus(task.id, 'InProgress')
        setTask((prev) => (prev ? { ...prev, status: 'InProgress' } : prev))
      } catch (e) {
        console.error(e)
      }
    }
  }

  // --- Inhalt je Kachel (ohne zweite Headerzeile; Tabs-Header liegt in renderToolbar)
  const renderTileContent = (id: TileId) => {
    switch (id) {
      case 'left':
        return (
          <div className="h-full overflow-hidden rounded-xl bg-white">
            <div className="flex h-full flex-col">
              {leftTab === 'description' && (
                <div className="flex-1 overflow-y-auto p-4">
                  <h2 className="mb-2 text-xl font-semibold">Beschreibung</h2>
                  <h3 className="my-3 text-lg font-semibold">{task?.title}</h3>
                  {task && <Description description={task.description} />}
                </div>
              )}
              {leftTab === 'lection' && (
                <div className="flex-1 overflow-y-auto p-4">
                  <h2 className="mb-2 text-xl font-semibold">Lektionen</h2>
                  <Lection />
                </div>
              )}
              {leftTab === 'solution' && (
                <div className="flex-1 overflow-y-auto p-4">
                  <h2 className="mb-2 text-xl font-semibold">Lösung</h2>
                  {task?.solution ? (
                    <ReactMarkdown>{task.solution}</ReactMarkdown>
                  ) : (
                    <p className="italic text-gray-500">
                      Noch keine Lösung eingereicht.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )

      case 'code':
        return (
          <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
            <div className="flex-1 overflow-hidden">
              <CodeEditor value={code} onChange={handleCodeChange} />
            </div>
            {isCompiled ? (
              <div>
                {isCompiled ? (
                  <div className="mt-4 bg-green-500 pl-4">
                    <h2 className="text-xl font-semibold ">
                      Alle Tests sind richtig
                    </h2>
                  </div>
                ) : (
                  <div className="mt-4 bg-red-500">
                    <h2 className="text-xl font-semibold">
                      Leider sind tests fehlgeschlagen
                    </h2>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        )

      case 'ai':
        return (
          <div className="flex h-full min-h-0 min-w-0 flex-col rounded-xl bg-white">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              {/* EINZIGER Scrollbereich */}
              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-2">
                {isLoading ? (
                  <div className="relative mt-4 h-16 w-full overflow-hidden rounded bg-gray-100 dark:bg-neutral-400">
                    <div
                      className="
      absolute inset-0
      animate-shimmer will-change-[background-position]
      [background-image:linear-gradient(90deg,transparent,rgba(0,0,0,0.08),transparent)]
      [background-position:-200%_0]
      [background-size:200%_100%]
      motion-reduce:animate-none
      dark:[background-image:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)]
    "
                    />
                  </div>
                ) : answer ? (
                  <div className="mt-4 w-full min-w-0 max-w-full whitespace-normal text-wrap rounded p-2">
                    <ReactMarkdown>{answer}</ReactMarkdown>
                  </div>
                ) : null}
              </div>

              {/* STICKY FOOTER (fixiert am unteren Rand des Viewports des Scrollbereichs) */}
              <div className="sticky bottom-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="flex flex-col gap-2 p-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button className="m-0" onClick={handleSubmit}>
                      Überprüfen lassen
                    </Button>
                    <Button className="m-0" onClick={handlekhSubmit}>
                      KH Feedback
                    </Button>
                    <Button className="m-0" onClick={handlekmSubmit}>
                      KM Feedback
                    </Button>
                    <Button className="m-0" onClick={handlekrSubmit}>
                      KR Feedback
                    </Button>
                  </div>

                  <form
                    className="relative w-full"
                    onSubmit={async (e) => {
                      e.preventDefault()
                      if (!input || !task?.id || !code) return
                      setIsLoading(true)
                      setAnswer(null)
                      try {
                        const response = await askPilot(task.id, code, input)
                        setAnswer(response)
                        setInput('')
                      } catch (err) {
                        console.error(err)
                        setAnswer('Fehler beim Abruf')
                      } finally {
                        setIsLoading(false)
                      }
                    }}
                  >
                    <input
                      className="bg-background w-full rounded-xl border px-4 py-3 pr-28 outline-none focus:ring-2 focus:ring-[#fafafa]"
                      type="text"
                      placeholder="Frag etwas zur Aufgabe…"
                      autoFocus
                      maxLength={200}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <span className="text-muted-foreground pointer-events-none absolute right-14 top-1/2 -translate-y-1/2 text-xs">
                      {200 - (input?.length ?? 0)}
                    </span>
                    <button
                      type="submit"
                      aria-label="Senden"
                      disabled={!input || input.length === 0}
                      className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-3xl border bg-[#0090ff] text-black disabled:opacity-50"
                    >
                      <ArrowUpIcon className="size-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  if (error) return <p className="text-red-500">{error}</p>
  if (!task) return <p className="text-white">Lade Task…</p>

  return (
    <div className="  h-full flex-1 bg-gradient-to-br">
      <div className="mx-auto h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] max-w-full bg-[#f0f0f0] p-3">
        <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-transparent">
          <Mosaic<TileId>
            value={mosaicTree}
            onChange={(newTree) => {
              setMosaicTree(newTree as Node)
              saveTree(newTree as Node)
            }}
            renderTile={(id, path) => (
              <MosaicWindow<TileId>
                path={path}
                title=""
                additionalControls={[]} // keine Default-Buttons
                className="window-mosaic rounded-lg !border-0 !shadow-none"
                renderToolbar={() => {
                  switch (id) {
                    case 'left':
                      // ► Toolbar mit Radix Tabs (wie zuvor), steuert leftTab
                      return (
                        <div className="w-full border-b bg-[#fafafa]">
                          <Tabs.Root
                            value={leftTab}
                            onValueChange={(v) => setLeftTab(v as LeftTab)}
                          >
                            <Tabs.List className="flex shrink-0 bg-[#fafafa] px-3">
                              <Tabs.Trigger
                                value="description"
                                className="text-sm font-medium focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                              >
                                <ReaderIcon color="#006fff" className="mr-2" />
                                Aufgabe
                              </Tabs.Trigger>
                              <Tabs.Trigger
                                value="lection"
                                className="ml-4 text-sm font-medium focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                              >
                                Lektion
                              </Tabs.Trigger>
                              <Tabs.Trigger
                                value="solution"
                                disabled
                                className="ml-4 text-sm font-medium opacity-60"
                              >
                                <LockClosedIcon className="mr-2" />
                                Lösung
                              </Tabs.Trigger>
                            </Tabs.List>
                          </Tabs.Root>
                        </div>
                      )
                    case 'code':
                      return (
                        <div className="flex w-full items-center justify-between border-b bg-[#fafafa] px-3 py-2">
                          <div className="flex items-center  gap-2">
                            <CodeIcon color="#37aa59" />
                            <h2>Code</h2>
                          </div>
                          <IconButton
                            variant="ghost"
                            onClick={() => console.log(path)}
                          >
                            <EnterFullScreenIcon />
                          </IconButton>
                        </div>
                      )
                    case 'ai':
                      return (
                        <div className="flex w-full items-center gap-2 border-b bg-[#fafafa] px-3 py-2">
                          <ChatBubbleIcon color="#873ba4" />
                          <h2 className="font-medium">CodeTutor</h2>
                        </div>
                      )
                  }
                }}
              >
                {renderTileContent(id)}
              </MosaicWindow>
            )}
            className="task-mosaic h-full"
          />
        </div>
      </div>
    </div>
  )
}

export default TaskDetail
