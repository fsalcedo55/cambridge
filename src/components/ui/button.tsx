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
    <>
      {loading ? (
        <button
          className={clsx(
            `normal-case btn no-animation bg-neutral-100 loading text-neutral-900 text-base rounded-full ${className}`,
            {
              "min-w-full": fullWidth === true,
            }
          )}
        >
          {loadingLabel}
        </button>
      ) : (
        <button
          type={type}
          className={clsx(
            `btn no-animation normal-case text-base font-semibold rounded-full ${className}`,
            {
              "bg-primary-500 text-white border-0 hover:bg-primary-700":
                intent === "primary",
              "btn-secondary": intent === "secondary",
              "bg-danger-100 text-danger-900 hover:bg-danger-200":
                intent === "danger",
              "btn-outline bg-neutral-100 hover:bg-neutral-200 text-neutral-900 hover:text-neutral-900 border-0":
                intent === "cancel",
              "btn-sm": size === "small",
              "btn-md": size === "medium",
              "btn-lg": size === "large",
              "min-w-full": fullWidth === true,
            }
          )}
          onClick={onClick}
        >
          {children}
        </button>
      )}
    </>
  )
}
