import { CgSpinner } from "react-icons/cg"
import clsx from "clsx"

interface Props {
  size?: "small" | "medium" | "large"
  className?: string
}

export default function Loading({ size, className }: Props) {
  return (
    <div className="flex items-center justify-center">
      {size ? (
        <span
          className={clsx(`text-primary ${className}`, {
            "text-2xl": size === "small",
            "text-4xl": size === "medium",
            "text-6xl": size === "large",
          })}
        >
          <CgSpinner className="animate-spin" />
        </span>
      ) : (
        <span className="text-4xl text-primary">
          <CgSpinner className="animate-spin" />
        </span>
      )}
    </div>
  )
}
