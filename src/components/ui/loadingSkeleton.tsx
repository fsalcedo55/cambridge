interface Props {
  height?: string
}

export default function LoadingSkeleton({ height }: Props) {
  if (height === "short") {
    return (
      <div role="status" className="max-w-sm animate-pulse">
        <div className="w-48 h-2 bg-gray-200 rounded-full"></div>
      </div>
    )
  }
  if (height === "medium") {
    return (
      <div role="status" className="max-w-sm animate-pulse">
        <div className="w-48 h-3 bg-gray-200 rounded-full"></div>
      </div>
    )
  }

  return (
    <div role="status" className="max-w-sm animate-pulse">
      <div className="w-48 h-6 bg-gray-200 rounded-full"></div>
    </div>
  )
}
