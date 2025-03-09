"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { ConsoleMessage } from "@/features/editor/service"
import { useService } from "./service"

interface ConsoleOutputProps {
  messages: ConsoleMessage[]
  onClear: () => void
  isDarkMode: boolean
}

export default function ConsoleOutput({ messages, onClear, isDarkMode }: ConsoleOutputProps) {
  const { getMessageStyle, formatTime } = useService()

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="p-2 border-b dark:border-gray-700 flex justify-between items-center">
        <h2 className="font-medium text-gray-900 dark:text-white">Console</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 px-2 text-gray-700 dark:text-white hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-2 font-mono text-sm">
        {messages.length === 0 ? (
          <div className="text-gray-400 italic p-2">Console output will appear here</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`py-1 border-b dark:border-gray-700 last:border-0 ${getMessageStyle(msg.method, isDarkMode)}`}
            >
              <span className="text-gray-400 text-xs mr-2">{formatTime(msg.timestamp)}</span>
              {msg.args.map((arg, i) => (
                <span key={i} className="whitespace-pre-wrap break-words">
                  {arg}
                  {i < msg.args.length - 1 ? " " : ""}
                </span>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

