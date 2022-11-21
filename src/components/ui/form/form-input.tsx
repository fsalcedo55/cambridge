import {
  RegisterOptions,
  UseFormRegister,
  Path,
  FieldError,
  FieldValues,
} from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { Input, InputProps } from "@src/components/ui/form/input"
import { FormErrorMessage } from "@ui/form/formErrorMessage"

export type FormInputProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>
  rules?: RegisterOptions
  register?: UseFormRegister<TFormValues>
  errors?: { [x: string]: any } | undefined
} & Omit<InputProps, "name">

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
          <ErrorMessage
            name={name as any}
            errors={errors}
            render={({ message }) => (
              <FormErrorMessage>{message}</FormErrorMessage>
            )}
          />
        }
      />
    </div>
  )
}
