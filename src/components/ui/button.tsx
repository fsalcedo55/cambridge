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
        "btn-primary": intent === "primary",
        "btn-secondary": intent === "secondary",
        "btn-error": intent === "danger",
        "btn-outline": intent === "cancel",
        "btn-disabled loading": loading,
        "btn-md": size === "medium",
        "btn-lg": size === "large",
      })}
      onClick={onClick}
    >
      {loading ? loadingLabel : children}
    </button>
  )
}
