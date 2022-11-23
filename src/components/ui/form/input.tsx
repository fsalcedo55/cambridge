/*

import { useForm } from "react-hook-form"

interface Props {
  labelPlaceholder: any
  type: any
  value: any
  name: any
  change: any
  label?: string
  defaultValue?: string
  inputName?: string
}

type Inputs = {
  inputNameType: string
}

export default function Input({
  labelPlaceholder,
  type,
  value,
  name,
  change,
  defaultValue,
  label,
  inputName,
  ...rest
}: Props) {
  // const { register } = useForm<Inputs>()
  return (
    // <div className="w-full">
    //   <label className="label">
    //     <span className="label-text">{label}</span>
    //  <span className="label-text-alt">Alt label 1</span>
    // </label>
    <input
      // {...register(inputName, { required: required })}
      type="text"
      placeholder={labelPlaceholder}
      className="w-full input input-bordered"
      defaultValue={defaultValue}
    />
    //   <label className="label">
    //     <span className="label-text-alt text-error">{error}</span>
    //     <span className="label-text-alt">Alt label 3</span>
    //   </label>
    // </div>
  )
}

*/

import React, { FC, forwardRef } from "react"

export type InputType = "text" | "email" | "date" | "select"

export type InputProps = {
  id: string
  name: string
  label: string
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
