"use client"

import { useCallback } from "react"

export function useService() {
  // Get style for console message based on method
  const getMessageStyle = useCallback((method: string, isDarkMode: boolean) => {
    switch (method) {
      case "error":
        return "text-red-500"
      case "warn":
        return "text-yellow-500"
      case "info":
        return "text-blue-500"
      default:
        return isDarkMode ? "text-gray-200" : "text-gray-800"
    }
  }, [])

  // Format timestamp for display
  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }, [])

  return {
    getMessageStyle,
    formatTime,
  }
}

