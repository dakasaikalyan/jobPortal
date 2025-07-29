"use client"

export function LoadingSpinner({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`} role="status">
      <svg
        aria-hidden="true"
        className="w-full h-full text-gray-200 animate-spin fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          className="opacity-25"
        />
        <path
          d="M100 50a50 50 0 11-100 0 50 50 0 01100 0z"
          fill="currentFill"
          className="opacity-75"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
} 