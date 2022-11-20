import { useForm } from "react-hook-form"

interface Props {
  label: string
  labelPlaceholder?: string
  labelDefaultValue?: string
  error?: string
  inputName?: any
  required?: boolean
  register?: any
}

type Inputs = {
  inputNameType: string
}

export default function Input({
  label,
  labelPlaceholder,
  labelDefaultValue,
  error,
  inputName,
  required,
  register,
}: Props) {
  // const { register } = useForm<Inputs>()
  return (
    <div className="w-full">
      <label className="label">
        <span className="label-text">{label}</span>
        {/* <span className="label-text-alt">Alt label 1</span> */}
      </label>
      <input
        ref={register}
        // {...register(inputName, { required: required })}
        type="text"
        placeholder={labelPlaceholder}
        className="w-full input input-bordered"
        defaultValue={labelDefaultValue}
      />
      <label className="label">
        <span className="label-text-alt text-error">{error}</span>
        {/* <span className="label-text-alt">Alt label 3</span> */}
      </label>
    </div>
  )
}
