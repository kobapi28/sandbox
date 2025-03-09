"use client"

import { useEffect, useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ConsoleMessage } from "@/features/editor/service"

interface PreviewProps {
  html: string
  css: string
  js: string
  onConsoleMessage: (message: ConsoleMessage) => void
  hasChanges: boolean
  onExecute: () => void
  previewKey?: number // 追加: Previewを強制的に更新するためのキー
}

export default function Preview({
  html,
  css,
  js,
  onConsoleMessage,
  hasChanges,
  onExecute,
  previewKey = 0,
}: PreviewProps) {
  // Generate the HTML content directly in the component
  const generateContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            // Capture console logs
            const originalConsole = console;
            console = {
              log: function(...args) {
                originalConsole.log(...args);
                window.parent.postMessage({
                  type: 'console',
                  method: 'log',
                  args: args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                  )
                }, '*');
              },
              error: function(...args) {
                originalConsole.error(...args);
                window.parent.postMessage({
                  type: 'console',
                  method: 'error',
                  args: args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                  )
                }, '*');
              },
              warn: function(...args) {
                originalConsole.warn(...args);
                window.parent.postMessage({
                  type: 'console',
                  method: 'warn',
                  args: args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                  )
                }, '*');
              },
              info: function(...args) {
                originalConsole.info(...args);
                window.parent.postMessage({
                  type: 'console',
                  method: 'info',
                  args: args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                  )
                }, '*');
              }
            };

            // Capture errors
            window.onerror = function(message, source, lineno, colno, error) {
              window.parent.postMessage({
                type: 'console',
                method: 'error',
                args: [message]
              }, '*');
              return true;
            };

            // User JS
            try {
              ${js}
            } catch (error) {
              console.error(error.message);
            }
          </script>
        </body>
      </html>
    `
  }

  // Set up message listener for console output
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "console") {
        onConsoleMessage({
          method: event.data.method,
          args: event.data.args,
          timestamp: new Date(),
        })
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [onConsoleMessage])

  // Force re-render when content changes or previewKey changes
  const [key, setKey] = useState(0)

  useEffect(() => {
    // previewKeyが変更されたらiframeを再レンダリング
    setKey(previewKey)
  }, [previewKey])

  // 実行ボタンがクリックされたときの処理
  const handleExecute = () => {
    onExecute()
    setKey((prev) => prev + 1) // iframeを再レンダリング
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end items-center p-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <Button
          onClick={handleExecute}
          className={`flex items-center gap-2 ${hasChanges ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200"}`}
          disabled={!hasChanges}
        >
          <Play className="h-4 w-4" />
          {hasChanges ? "Run" : "No Changes"}
        </Button>
      </div>
      <div className="flex-1">
        <iframe
          key={key}
          title="Preview"
          sandbox="allow-scripts"
          className="w-full h-full border-0 bg-white"
          srcDoc={generateContent()}
        />
      </div>
    </div>
  )
}

