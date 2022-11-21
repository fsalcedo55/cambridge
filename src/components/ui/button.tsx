import clsx from "clsx"

interface Props {
  children: React.ReactNode
  intent?: "primary" | "secondary" | "danger" | "cancel"
  loading?: boolean
  loadingLabel?: string
  onClick?: any
  type?: "button" | "submit" | "reset" | undefined
  size?: "small" | "medium" | "large"
  className?: string
  fullWidth?: boolean
}

export function Button({
  children,
  intent,
  onClick,
  loading,
  loadingLabel,
  type,
  size,
  className,
  fullWidth,
}: Props) {
  return (
    <button
      type={type}
      className={clsx(`btn ${className}`, {
        "bg-primary text-white border-0 hover:bg-primary-focus":
          intent === "primary",
        "btn-secondary": intent === "secondary",
        "btn-error": intent === "danger",
        "btn-outline bg-base-200 hover:bg-base-300 hover:text-base-content text-base-content border-0":
          intent === "cancel",
        "btn-disabled loading bg-base-300 text-base-content": loading,
        "btn-sm": size === "small",
        "btn-md": size === "medium",
        "btn-lg": size === "large",
        "min-w-full": fullWidth === true,
      })}
      onClick={onClick}
    >
      {loading ? loadingLabel : children}
    </button>
  )
}
