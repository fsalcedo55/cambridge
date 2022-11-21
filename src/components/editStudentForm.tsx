/*
import { useForm, SubmitHandler } from "react-hook-form"

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
      <input
        {...register("firstName", { required: true })}
        className="w-full max-w-md input input-bordered input-primary"
        defaultValue={student.studentFirstName}
      />
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
 */

import React, { FC } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "@src/components/ui/form/form-input"
import { Button } from "./ui/button"
import { trpc } from "@src/utils/trpc"
import { Student } from "@src/interfaces"

export type RegistrationFormFields = {
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
  } = useForm<RegistrationFormFields>()

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

  // const formattedArray = teachers?.map((el, idx) => el.name)

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <FormInput<RegistrationFormFields>
        id="firstName"
        type="text"
        name="firstName"
        label="First Name"
        register={register}
        rules={{ required: "You must enter a first name." }}
        errors={errors}
        defaultValue={currentStudent.studentFirstName}
      />
      <FormInput<RegistrationFormFields>
        id="lastName"
        type="text"
        name="lastName"
        label="Last Name"
        register={register}
        rules={{ required: "You must enter a last name." }}
        errors={errors}
        defaultValue={currentStudent.studentLastName}
      />
      <FormInput<RegistrationFormFields>
        id="dateOfBirth"
        type="date"
        name="dateOfBirth"
        label="Date of Birth"
        register={register}
        rules={{ required: "You must enter a date of birth." }}
        errors={errors}
        defaultValue={currentStudent.studentDateOfBirth}
      />
      {/* <FormInput<RegistrationFormFields>
        id="teacher"
        type="select"
        name="teacher"
        label="Teacher"
        register={register}
        rules={{ required: "You must select a teacher." }}
        errors={errors}
        defaultValue={currentStudent.teacher.name}
        arrayData={teachers}
        arrayDataElement="name"
      /> */}

      <div>
        <label className="py-0 label">
          <span className="label-text">Teacher</span>
        </label>

        <select
          // id="teacher"
          // type="select"
          // aria-label="teacher"
          // defaultValue={currentStudent.teacher.name}
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
