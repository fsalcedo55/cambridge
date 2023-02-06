import React, { FC, forwardRef } from "react"

export type InputType = "text" | "email" | "date" | "select" | "number"

export type InputProps = {
  id: string
  name: string
  label?: string
  type?: InputType
  placeholder?: string
  defaultValue?: string
  errors: any
  arrayData?: any[]
  arrayDataElement?: string
}

export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      label,
      placeholder,
      defaultValue,
      type,
      errors,
      arrayData,
      arrayDataElement,
      ...props
    },
    ref
  ) => {
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
          aria-label={label}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="w-full input input-bordered"
          {...props}
        />
        <label className="pt-0 pb-1.5 label">
          <div className="h-2 label-text-alt text-error">
            {errors ? errors : ""}
          </div>
        </label>
      </div>
    )
  }
)

Input.displayName = "Input"
