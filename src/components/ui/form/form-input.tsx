import type {
  RegisterOptions,
  UseFormRegister,
  Path,
  FieldError,
  FieldValues,
} from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { Input, type InputProps } from "@src/components/ui/form/input"
import { FormErrorMessage } from "@ui/form/formErrorMessage"

export type FormInputProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>
  rules?: RegisterOptions
  register?: UseFormRegister<TFormValues>
  errors?: Partial<Record<string, FieldError>>
} & Omit<InputProps, "name" | "errors">

export const FormInput = <TFormValues extends Record<string, unknown>>({
  name,
  register,
  rules,
  errors,
  ...props
}: FormInputProps<TFormValues>): JSX.Element => {
  return (
    <div aria-live="polite">
      <Input
        name={name}
        {...props}
        {...(register && register(name, rules))}
        errors={
          errors && (
            <ErrorMessage
              name={name as Path<TFormValues>}
              errors={errors}
              render={({ message }) => (
                <FormErrorMessage>{message}</FormErrorMessage>
              )}
            />
          )
        }
      />
    </div>
  )
}
