// CodeEditor.tsx
import React, { useContext, useRef, useState } from 'react'
import Editor, { OnChange as MonacoOnChange } from '@monaco-editor/react'
import type {
  EditorProps as MonacoEditorProps,
  OnMount
} from '@monaco-editor/react'
import { ThemeContext } from '@radix-ui/themes'
import { monaco } from 'react-monaco-editor'

export interface CodeEditorProps
  extends Partial<
    Pick<MonacoEditorProps, 'language' | 'theme' | 'height' | 'options'>
  > {
  /** Current code value */
  value: string | undefined
  /** Called when the code changes */
  onChange?: (value: string) => void
}

// Props for the CodeEditor
const CodeEditor: React.FC<CodeEditorProps & { showStatusBar?: boolean }> = ({
  value = '',
  onChange,
  language = 'csharp',
  theme = 'vs-dark',
  height = '800px',
  options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    acceptSuggestionOnEnter: 'on',
    acceptSuggestionOnCommitCharacter: true
  },
  showStatusBar = true
}) => {
  const { appearance } = useContext(ThemeContext)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 })
  const handleMount: OnMount = (editor) => {
    editorRef.current = editor
    editor.onDidChangeCursorPosition((e) =>
      setCursorPos({ line: e.position.lineNumber, column: e.position.column })
    )
  }
  const handleChange: MonacoOnChange = (newValue) => {
    if (onChange && typeof newValue === 'string') onChange(newValue)
  }

  return (
    <div className="flex h-full flex-col">
      <Editor
        value={value}
        language={language}
        theme={appearance === 'dark' ? 'vs-dark' : 'light'}
        height="100%"
        options={options}
        onChange={handleChange}
        onMount={handleMount}
        className="grow"
      />

      {/* optionale Statusbar */}
      <div className="flex select-none justify-end px-3 py-1 text-xs">
        Ln&nbsp;{cursorPos.line},&nbsp;Col&nbsp;{cursorPos.column}
      </div>
    </div>
  )
}

export default CodeEditor
