import React from "react"

interface Props {
  height?: string
}

export default function LoadingSkeleton({ height }: Props) {
  if (height === "short") {
    return (
      <div
        role="status"
        className="max-w-sm animate-pulse"
        data-testid="loading-skeleton"
      >
        <div className="h-2 rounded-full w-36 md:w-48 bg-neutral-100"></div>
      </div>
    )
  }
  if (height === "medium") {
    return (
      <div
        role="status"
        className="max-w-sm animate-pulse"
        data-testid="loading-skeleton"
      >
        <div className="h-3 rounded-full w-36 md:w-48 bg-neutral-100"></div>
      </div>
    )
  }

  return (
    <div
      role="status"
      className="max-w-sm animate-pulse"
      data-testid="loading-skeleton"
    >
      <div className="h-6 rounded-full w-36 md:w-48 bg-neutral-100"></div>
    </div>
  )
}
