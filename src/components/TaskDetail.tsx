import React, { useState } from 'react'
import { useParams } from 'react-router'
import { tasks } from '../utils/temp/tasks'
import Editor from '@monaco-editor/react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import Description from './Description/Description'
import CodeEditor from './Editor'
import { askPilot, PilotRequest } from 'services/QuestionService'
import { Button } from '@radix-ui/themes'

const TaskDetail = () => {
  const { title } = useParams()
  const decodedTitle = decodeURIComponent(title || '')
  const task = tasks.find((t) => t.title === decodedTitle)
  const [code, setCode] = useState<string>()
  const [question, setQuestion] = useState<string>('')
  const [answer, setAnswer] = useState<string | null>(null)

  const handleSubmit = async () => {
    const payload: PilotRequest = { code, question }
    try {
      const result = await askPilot(payload)
      setAnswer(result)
    } catch (err) {
      console.error(err)
      setAnswer('Fehler beim Abruf')
    }
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center bg-gray-50 p-4">
        <p className="text-red-500">Task not found.</p>
      </div>
    )
  }
  return (
    <div className="flex h-full flex-col overflow-hidden rounded p-2 text-white">
      {/* Main resizable panels: horizontal split */}
      <PanelGroup
        direction="horizontal"
        className="flex h-full flex-1 overflow-hidden"
      >
        {/* Description Panel */}
        <Panel
          defaultSize={10}
          className="h-full overflow-y-auto rounded bg-[#ffffff1a] shadow"
        >
          <h2 className="mb-2 pl-2 pt-2 text-xl font-semibold">Description</h2>
          <div className="size-full rounded border border-gray-300 border-transparent bg-[#262626] pl-4">
            <h2 className="my-3 text-xl font-semibold">{task.title}</h2>
            <div className="w-full overflow-y-auto">
              <Description description={task.description} />
            </div>
          </div>
        </Panel>
        <PanelResizeHandle className="w-2 cursor-col-resize" />
        {/* Right: vertical split between Code and AI */}
        <PanelGroup
          direction="vertical"
          className="flex h-full flex-1 overflow-hidden"
        >
          {/* Code Editor Panel */}
          <Panel
            defaultSize={70}
            minSize={20}
            className="flex flex-col overflow-hidden rounded bg-[#ffffff1a] shadow"
          >
            <h2 className="mb-2 pl-2 pt-2 text-xl font-semibold text-white">
              Code
            </h2>
            <div className="size-full rounded border border-gray-300 border-transparent bg-[#262626]">
              <CodeEditor
                value={task.code}
                onChange={(newCode) => setCode(newCode)}
              />
            </div>
          </Panel>
          <PanelResizeHandle className="h-2 cursor-row-resize" />

          {/* AI Assistant Panel */}
          <Panel
            defaultSize={30}
            minSize={10}
            className="overflow-auto rounded bg-[#ffffff1a] shadow"
          >
            <h2 className="mb-2 pl-2 pt-2 text-xl font-semibold">
              AI Assistant
            </h2>
            <div className="size-full rounded border border-gray-300 border-transparent bg-[#262626] p-2">
              <Button className="m-2" onClick={handleSubmit}>
                {' '}
                Pilot Fragen
              </Button>
              {answer && (
                <pre className="mt-4 rounded bg-gray-800 p-2 text-white">
                  {answer}
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
