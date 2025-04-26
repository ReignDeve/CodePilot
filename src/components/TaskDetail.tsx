import React from 'react'
import { useParams } from 'react-router'
import { tasks } from '../utils/temp/tasks'
import Editor from '@monaco-editor/react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'

const TaskDetail = () => {
  const { title } = useParams()
  const decodedTitle = decodeURIComponent(title || '')
  const task = tasks.find((t) => t.title === decodedTitle)

  if (!task) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 p-4">
        <p className="text-red-500">Task not found.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen h-screen w-screen p-4 rounded text-white">
      {/* Main resizable panels: horizontal split */}
      <PanelGroup
        direction="horizontal"
        className="flex flex-1 h-full overflow-hidden"
      >
          {/* Description Panel */}
          <Panel
            defaultSize={10}
            className="bg-white p-4 rounded shadow h-full overflow-auto bg-[#262626]"
          >
            <h2 className="text-xl font-semibold mb-2 text-white">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap text-white">
              {task.description}
            </p>
          </Panel>
          <PanelResizeHandle className="w-2 cursor-col-resize" />
        {/* Right: vertical split between Code and AI */}
        <PanelGroup
          direction="vertical"
          className="flex flex-1 h-full overflow-hidden"
        >
          {/* Code Editor Panel */}
          <Panel
            defaultSize={70}
            minSize={20}
            className="rounded shadow flex flex-col overflow-hidden bg-[#262626]"
          >
            <div>
            <h2 className="text-xl font-semibold mb-2 text-white pl-2 pt-2">Code</h2>
              <Editor
                height="100%"
                defaultLanguage="csharp"
                theme="vs-dark"
                options={{ automaticLayout: true }}
                className='rounded bg-[#262626]'
              />
              </div>
          </Panel>
          <PanelResizeHandle className="h-2 cursor-row-resize" />

          {/* AI Assistant Panel */}
          <Panel
            defaultSize={30}
            minSize={10}
            className="bg-white p-4 rounded shadow overflow-auto bg-[#262626]"
          >
            <h2 className="text-xl font-semibold mb-2">AI Assistant</h2>
            <div className="w-full h-full border border-gray-300 rounded border-transparent bg-[#ffffff1a]" />
          </Panel>
        </PanelGroup>
      </PanelGroup>
    </div>
  )
}

export default TaskDetail
