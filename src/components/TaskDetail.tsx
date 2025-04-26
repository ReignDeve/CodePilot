import React from 'react'
import { useParams } from 'react-router'
import { tasks } from '../utils/temp/tasks'
import Editor from '@monaco-editor/react'

const TaskDetail = () => {
    const { title } = useParams();
    const decodedTitle = decodeURIComponent(title || '');
    const task = tasks.find(t => t.title === decodedTitle);
  
    if (!task) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-4">
          <p className="text-red-500">Task not found.</p>
        </div>
      );
    }
  
    return (
      <div className="flex flex-col h-screen bg-gray-50 px-4 py-4">
        {/* Main content splits below any header above */}
        <div className="flex flex-1 overflow-hidden">
          {/* Description Panel */}
          <div className="w-1/3 bg-white p-4 rounded shadow h-full overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
          </div>
  
          {/* Editor & AI Panel */}
          <div className="w-2/3 ml-4 flex flex-col h-full">
            {/* Code Editor */}
            <div className="bg-white p-4 rounded shadow flex-1 flex flex-col overflow-hidden">
              <h2 className="text-xl font-semibold mb-2">Code</h2>
              <div className="flex-1 overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="csharp"
                  theme="vs-dark"
                  options={{ automaticLayout: true }}
                />
              </div>
            </div>
  
            {/* AI Assistant Placeholder */}
            <div className="bg-white p-4 rounded shadow mt-4 h-32 shrink-0">
              <h2 className="text-xl font-semibold mb-2">AI Assistant</h2>
              <div className="w-full h-full border border-gray-300 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default TaskDetail;
  
