import { useForm } from "react-hook-form"
import { FormInput } from "@src/components/ui/form/form-input"
import { Button } from "./ui/button"
import { trpc } from "@src/utils/trpc"
import { Student } from "@src/interfaces"

export type FormFields = {
  firstName: string
  lastName: string
  dateOfBirth: string
  teacher: string
}

interface Props {
  currentStudent: Student
  teachers?: any[]
  closeModal: () => void
}

export default function EditStudentForm({
  currentStudent,
  teachers,
  closeModal,
}: Props) {
  const editStudent = trpc.student.editStudent.useMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await editStudent.mutateAsync({
        studentFirstName: data.firstName as string,
        studentLastName: data.lastName as string,
        studentDateOfBirth: data.dateOfBirth as string,
        userId: data.teacher,
        id: currentStudent.id as string,
      })
    } catch (error) {
      console.log("Error editing student", error)
    }
    console.log("data: ", data)
    closeModal()
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <FormInput<FormFields>
        id="firstName"
        type="text"
        name="firstName"
        label="First Name"
        register={register}
        rules={{ required: "You must enter a first name." }}
        errors={errors}
        defaultValue={currentStudent.studentFirstName}
      />
      <FormInput<FormFields>
        id="lastName"
        type="text"
        name="lastName"
        label="Last Name"
        register={register}
        rules={{ required: "You must enter a last name." }}
        errors={errors}
        defaultValue={currentStudent.studentLastName}
      />
      <FormInput<FormFields>
        id="dateOfBirth"
        type="date"
        name="dateOfBirth"
        label="Date of Birth"
        register={register}
        rules={{ required: "You must enter a date of birth." }}
        errors={errors}
        defaultValue={currentStudent.studentDateOfBirth}
      />

      <div className="mb-2">
        <label className="py-0 label">
          <span className="label-text">Teacher</span>
        </label>
        <select
          className="w-full select select-bordered"
          {...register("teacher")}
        >
          <option disabled selected value={currentStudent.teacher.id}>
            {currentStudent.teacher.name}
          </option>
          {teachers?.map((teacher) => (
            <option value={teacher.id} key={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        intent="primary"
        size="medium"
        fullWidth
        className="my-2"
        loading={editStudent.isLoading}
        loadingLabel="Saving..."
      >
        Save
      </Button>
    </form>
  )
}
