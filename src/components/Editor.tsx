// CodeEditor.tsx
import React from 'react';
import Editor, { OnChange as MonacoOnChange } from '@monaco-editor/react';
import type { EditorProps as MonacoEditorProps } from '@monaco-editor/react';

// Props for the CodeEditor
export interface CodeEditorProps extends Partial<Pick<MonacoEditorProps, 'language' | 'theme' | 'height' | 'options'>> {
  /** Current code value */
  value: string | undefined;
  /** Called when the code changes */
  onChange?: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value = "",
  onChange,
  language = 'csharp',
  theme = 'vs-dark',
  height = '400px',
  options = { selectOnLineNumbers: true, roundedSelection: false, readOnly: false },
}) => {
  // Internal change handler adapts Monaco callback to our onChange
  const handleChange: MonacoOnChange = (newValue) => {
    if (onChange && typeof newValue === 'string') {
      onChange(newValue);
    }
  };

  return (
    <Editor
      value={value}
      language={language}
      theme={theme}
      height={height}
      options={options}
      onChange={handleChange}
    />
  );
};

export default CodeEditor;
