"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface Toast {
  id: number
  message: string
  type?: "success" | "error" | "info" | "warning"
  duration?: number
  action?: string
  entity?: string
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info" | "warning", duration?: number) => void
  showActionToast: (action: string, entity: string, success: boolean, details?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info", duration: number = 3500) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type, duration }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }

  const showActionToast = (action: string, entity: string, success: boolean, details?: string) => {
    const message = success 
      ? `${action} ${entity} successfully${details ? `: ${details}` : ''}`
      : `Failed to ${action.toLowerCase()} ${entity}${details ? `: ${details}` : ''}`
    
    const type = success ? "success" : "error"
    showToast(message, type, success ? 4000 : 6000)
  }

  return (
    <ToastContext.Provider value={{ showToast, showActionToast }}>
      {children}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[10001] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-3 rounded shadow-lg text-white font-medium animate-fade-in-up transition-all
              ${toast.type === "success" ? "bg-green-600" : 
                toast.type === "error" ? "bg-red-600" : 
                toast.type === "warning" ? "bg-yellow-600" : "bg-blue-600"}
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within a ToastProvider")
  return context
} 