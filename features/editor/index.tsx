"use client"

import { Resizable } from "re-resizable"
import { Share2, Code2, Palette, FileJson, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Editor from "./components/Editor"
import Preview from "./components/Preview"
import ConsoleOutput from "./components/ConsoleOutput"
import { useService } from "./service"
import { useEffect } from "react"

export default function CodePenClone() {
  const {
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
    setHtml,
    setCss,
    setJs,
    setActiveTab,
    setIsEditorCollapsed,
    setIsDarkMode,
    handleCopyShareLink,
    handleConsoleMessage,
    clearConsole,
    executeCode,
  } = useService()

  // エディタのレイアウトを強制的に更新するための処理
  useEffect(() => {
    const handleResize = () => {
      // ウィンドウリサイズ時にレイアウトを更新するためのダミーステート更新
      setActiveTab((prev) => prev)
    }

    window.addEventListener("resize", handleResize)

    // 初期表示時にもレイアウトを更新
    setTimeout(handleResize, 500)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [setActiveTab])

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <header className="border-b dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            <span>Sandbox</span>
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="gap-2 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyShareLink}
              className="gap-2 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Editor Panel */}
        <Resizable
          defaultSize={{ width: "50%", height: "100%" }}
          minWidth="0%"
          maxWidth="100%"
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          className={`border-r dark:border-gray-700 h-full ${isEditorCollapsed ? "w-0 p-0 m-0 border-0" : ""}`}
          onResizeStop={() => {
            // リサイズ後にエディタのレイアウトを更新
            setActiveTab((prev) => prev)
          }}
        >
          {!isEditorCollapsed && (
            <div className="flex flex-col h-full">
              {/* Tab Navigation - Fixed Height */}
              <div className="h-12 min-h-[48px] bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex">
                <button
                  className={`flex-1 h-full flex items-center justify-center gap-2 ${
                    activeTab === "html"
                      ? "bg-gray-100 dark:bg-gray-700 border-b-2 border-primary text-primary dark:text-white"
                      : "hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("html")}
                >
                  <Code2 className="h-4 w-4" />
                  HTML
                </button>
                <button
                  className={`flex-1 h-full flex items-center justify-center gap-2 ${
                    activeTab === "css"
                      ? "bg-gray-100 dark:bg-gray-700 border-b-2 border-primary text-primary dark:text-white"
                      : "hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("css")}
                >
                  <Palette className="h-4 w-4" />
                  CSS
                </button>
                <button
                  className={`flex-1 h-full flex items-center justify-center gap-2 ${
                    activeTab === "js"
                      ? "bg-gray-100 dark:bg-gray-700 border-b-2 border-primary text-primary dark:text-white"
                      : "hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("js")}
                >
                  <FileJson className="h-4 w-4" />
                  JS
                </button>
              </div>

              {/* Editor Content - Takes remaining height */}
              <div className="flex-1 h-[calc(100%-48px)] overflow-hidden">
                {activeTab === "html" && (
                  <div className="h-full w-full">
                    <Editor key="html-editor" language="html" value={html} onChange={setHtml} isDarkMode={isDarkMode} />
                  </div>
                )}
                {activeTab === "css" && (
                  <div className="h-full w-full">
                    <Editor key="css-editor" language="css" value={css} onChange={setCss} isDarkMode={isDarkMode} />
                  </div>
                )}
                {activeTab === "js" && (
                  <div className="h-full w-full">
                    <Editor key="js-editor" language="javascript" value={js} onChange={setJs} isDarkMode={isDarkMode} />
                  </div>
                )}
              </div>
            </div>
          )}
        </Resizable>

        {/* Preview and Console Panel */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="h-12 min-h-[48px] border-b dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center px-4">
            <h2 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Play className="h-4 w-4" />
              Result
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditorCollapsed(!isEditorCollapsed)}
              className="text-gray-700 dark:text-white hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              {isEditorCollapsed ? "Show Editor" : "Hide Editor"}
            </Button>
          </div>

          <div className="flex-1 overflow-hidden">
            <Preview
              html={lastExecutedHtml}
              css={lastExecutedCss}
              js={lastExecutedJs}
              onConsoleMessage={handleConsoleMessage}
              hasChanges={hasChanges}
              onExecute={executeCode}
              previewKey={previewKey}
            />
          </div>

          <Resizable
            defaultSize={{ width: "100%", height: "30%" }}
            minHeight="0%"
            maxHeight="50%"
            enable={{
              top: true,
              right: false,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            className="border-t dark:border-gray-700"
          >
            <ConsoleOutput messages={consoleMessages} onClear={clearConsole} isDarkMode={isDarkMode} />
          </Resizable>
        </div>
      </main>
    </div>
  )
}

