import React, { forwardRef } from "react"
import { type FieldError } from "react-hook-form"

export type InputType = "text" | "email" | "date" | "select" | "number"

export type InputProps = {
  id: string
  name: string
  label?: string | React.ReactNode
  type?: InputType
  placeholder?: string
  defaultValue?: string
  errors?:
    | Partial<Record<string, FieldError>>
    | Record<string, string>
    | string
    | null
    | React.ReactNode
  arrayData?: Array<{ [key: string]: string | number }>
  arrayDataElement?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { id, name, label, placeholder, defaultValue, type, errors, ...props },
    ref
  ) => {
    const ariaLabel = typeof label === "string" ? label : undefined

    const renderError = () => {
      if (!errors) return ""
      if (React.isValidElement(errors)) return errors
      if (typeof errors === "string") return errors
      if (typeof errors === "object" && errors !== null) {
        return Object.values(errors)[0]?.message || ""
      }
      return ""
    }

    return (
      <div>
        <label className="py-0 label">
          <span className="label-text">{label}</span>
        </label>

        <input
          id={id}
          ref={ref}
          name={name}
          type={type}
          aria-label={ariaLabel}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="w-full input input-bordered"
          {...props}
        />

        <label className="pt-0 pb-1.5 label">
          <div className="h-2 label-text-alt text-error">{renderError()}</div>
        </label>
      </div>
    )
  }
)

Input.displayName = "Input"
