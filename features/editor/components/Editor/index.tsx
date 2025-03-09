"use client"
import MonacoEditor from "@monaco-editor/react"

interface EditorProps {
  language: string
  value: string
  onChange: (value: string) => void
  isDarkMode: boolean
}

export default function Editor({ language, value, onChange, isDarkMode }: EditorProps) {
  // エディタの基本設定
  const editorOptions = {
    tabSize: 2,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
  }

  // 値が変更されたときのハンドラ
  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue)
    }
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <MonacoEditor
        height="100%"
        width="100%"
        language={language}
        value={value}
        theme={isDarkMode ? "vs-dark" : "vs"}
        options={editorOptions}
        onChange={handleEditorChange}
        className="monaco-editor-container"
      />
    </div>
  )
}

