import clsx from "clsx"

// const buttonStyles =
// {  variants: {
//     intent: {
//       primary: "btn-primary",
//       danger: "btn-error",
//       disabled: "btn-disabled",
//     },
//     size: {
//       small: "btn-sm",
//       medium: "btn-md",
//       large: "btn-lg",
//     },
//     defaultVariants: { intent: "primary", size: "small" },
//   }}

interface Props {
  children: React.ReactNode
  intent?: "primary" | "secondary" | "danger" | "cancel"
  loading?: boolean
  loadingLabel?: string
  onClick?: any
  type?: "button" | "submit" | "reset" | undefined
  size?: "medium" | "large"
  className?: string
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
}: Props) {
  return (
    <button
      type={type}
      className={clsx(`btn btn-sm ${className}`, {
        "bg-primary text-white border-0 hover:bg-primary-focus":
          intent === "primary",
        "btn-secondary": intent === "secondary",
        "btn-error": intent === "danger",
        "btn-outline bg-base-200 hover:bg-base-300 hover:text-base-content text-base-content border-0":
          intent === "cancel",
        "btn-disabled loading bg-base-300 text-base-content": loading,
        "btn-md": size === "medium",
        "btn-lg": size === "large",
      })}
      onClick={onClick}
    >
      {loading ? loadingLabel : children}
    </button>
  )
}
