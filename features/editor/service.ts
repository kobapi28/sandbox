"use client"

import { useState, useEffect } from "react"
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string"

// Default code templates
const DEFAULT_HTML =
  '<div class="container">\n  <h1>Hello World</h1>\n  <p>Start editing to see some magic happen!</p>\n</div>'
const DEFAULT_CSS =
  "body {\n  font-family: sans-serif;\n}\n\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 2rem;\n}\n\nh1 {\n  color: #0070f3;\n}"
const DEFAULT_JS =
  'console.log("Hello from the console!");\n\n// Try editing the DOM\ndocument.querySelector("h1").addEventListener("click", () => {\n  console.log("Heading clicked!");\n  document.querySelector("h1").style.color = "#ff0000";\n});'

// Types
export type TabType = "html" | "css" | "js"
export type ConsoleMessage = {
  method: "log" | "error" | "warn" | "info"
  args: string[]
  timestamp: Date
}

export function useService() {
  // State
  const [html, setHtml] = useState(DEFAULT_HTML)
  const [css, setCss] = useState(DEFAULT_CSS)
  const [js, setJs] = useState(DEFAULT_JS)
  const [activeTab, setActiveTab] = useState<TabType>("html")
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([])
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // 実行関連の状態
  const [lastExecutedHtml, setLastExecutedHtml] = useState(DEFAULT_HTML)
  const [lastExecutedCss, setLastExecutedCss] = useState(DEFAULT_CSS)
  const [lastExecutedJs, setLastExecutedJs] = useState(DEFAULT_JS)
  const [hasChanges, setHasChanges] = useState(false)

  // URLからコードを読み込んだかどうかのフラグ
  const [loadedFromUrl, setLoadedFromUrl] = useState(false)

  // Load from URL on initial render
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      try {
        const decompressed = decompressFromEncodedURIComponent(hash)
        if (decompressed) {
          const { html: savedHtml, css: savedCss, js: savedJs } = JSON.parse(decompressed)

          // エディタの状態を更新
          setHtml(savedHtml || DEFAULT_HTML)
          setCss(savedCss || DEFAULT_CSS)
          setJs(savedJs || DEFAULT_JS)

          // 実行済みコードも同じに設定
          setLastExecutedHtml(savedHtml || DEFAULT_HTML)
          setLastExecutedCss(savedCss || DEFAULT_CSS)
          setLastExecutedJs(savedJs || DEFAULT_JS)

          // URLからロードしたフラグを設定
          setLoadedFromUrl(true)
        }
      } catch (error) {
        console.error("Failed to load from URL:", error)
      }
    }
  }, [])

  // URLからロードした場合、Previewを強制的に更新するためのキーを更新
  const [previewKey, setPreviewKey] = useState(0)

  useEffect(() => {
    if (loadedFromUrl) {
      // URLからロードした場合、Previewを強制的に更新
      setPreviewKey((prev) => prev + 1)
      // フラグをリセット
      setLoadedFromUrl(false)
    }
  }, [loadedFromUrl])

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // 変更検出
  useEffect(() => {
    const hasCodeChanged = html !== lastExecutedHtml || css !== lastExecutedCss || js !== lastExecutedJs

    setHasChanges(hasCodeChanged)
  }, [html, css, js, lastExecutedHtml, lastExecutedCss, lastExecutedJs])

  // Handlers
  const handleCopyShareLink = () => {
    // 現在のコードをURLに圧縮して保存
    const data = { html, css, js }
    const compressed = compressToEncodedURIComponent(JSON.stringify(data))
    window.history.replaceState(null, "", `#${compressed}`)

    // クリップボードにコピー
    navigator.clipboard.writeText(window.location.href)
    alert("Share link copied to clipboard!")
  }

  const handleConsoleMessage = (message: ConsoleMessage) => {
    setConsoleMessages((prev) => [...prev, message])
  }

  const clearConsole = () => {
    setConsoleMessages([])
  }

  // コードを実行する関数
  const executeCode = () => {
    // 現在のコードを実行済みコードとして保存
    setLastExecutedHtml(html)
    setLastExecutedCss(css)
    setLastExecutedJs(js)

    // 変更フラグをリセット
    setHasChanges(false)

    // コンソールをクリア
    clearConsole()

    // Previewを強制的に更新
    setPreviewKey((prev) => prev + 1)
  }

  return {
    // State
    html,
    css,
    js,
    activeTab,
    consoleMessages,
    isEditorCollapsed,
    isDarkMode,
    hasChanges,
    lastExecutedHtml,
    lastExecutedCss,
    lastExecutedJs,
    previewKey,

    // Setters
    setHtml,
    setCss,
    setJs,
    setActiveTab,
    setIsEditorCollapsed,
    setIsDarkMode,

    // Handlers
    handleCopyShareLink,
    handleConsoleMessage,
    clearConsole,
    executeCode,
  }
}

