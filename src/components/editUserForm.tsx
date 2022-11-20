import { useForm, SubmitHandler } from "react-hook-form"
import Input from "@ui/input"

interface Props {
  student: any
}

type Inputs = {
  firstName: string
  lastName: string
  teachers: string
}

export default function EditUserForm({ student }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) =>
    console.log("form data: ", data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Input
        label="First Name"
        labelDefaultValue={student.studentFirstName}
        inputName="firstName"
        required={true}
        register={{ ...register("firstName", { required: true }) }}
      />
      {/* <input
        {...register("firstName", { required: true })}
        className="w-full max-w-md input input-bordered input-primary"
        defaultValue={student.studentFirstName}
      /> */}
      {errors.firstName && <span>This field is required</span>}

      <input
        {...register("lastName", { required: true })}
        className="w-full max-w-md input input-bordered input-primary"
        defaultValue={student.studentLastName}
      />
      {errors.lastName && <span>This field is required</span>}

      <select
        {...register("teachers", { required: true })}
        className="w-full max-w-md select select-bordered"
        defaultValue={student.teacher.name}
      >
        <option value="">Select...</option>
        <option value="Elizabeth Tejeda">Elizabeth Tejeda</option>
        <option value="Paola Tellez">Paola Tellez</option>
      </select>
      {errors.teachers && <span>This field is required</span>}

      <input type="submit" className="w-full max-w-md btn btn-primary" />
    </form>
  )
}
