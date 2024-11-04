import { useForm } from "react-hook-form"
import { FormInput } from "@src/components/ui/form/form-input"
import { ButtonLegacy } from "./ui/buttonLegacy"
import { trpc } from "@src/utils/trpc"
import type { IStudent } from "@src/interfaces"
import { useState } from "react"

export type FormFields = {
  firstName: string
  lastName: string
  dateOfBirth: string
  teacher: string
  status: string
}

interface Props {
  currentStudent: IStudent
  teachers?: Array<{
    id: string
    name: string | null
  }>
  closeModal: () => void
}

export default function EditStudentForm({
  currentStudent,
  teachers,
  closeModal,
}: Props) {
  const [levelId, setLevelId] = useState<string[]>(
    getExistingLevelIds().length > 0 ? getExistingLevelIds() : []
  )
  const editStudent = trpc.student.editStudent.useMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const getLevels = trpc.level.getLevelsReduced.useQuery()

  function getExistingLevelIds() {
    const newArray: string[] = []
    currentStudent.entitlements.map(
      (entitlement: { Level: { id: string } }) => {
        if (newArray.includes(entitlement.Level.id) === false) {
          newArray.push(entitlement.Level.id)
        }
      }
    )
    return newArray
  }

  const handleCheckboxChange = (levelIdToAdd: string) => {
    if (levelId.includes(levelIdToAdd)) {
      // Remove the level id if it already exists in the array
      setLevelId(levelId.filter((id) => id !== levelIdToAdd))
    } else {
      // Add the level id if it doesn't exist in the array
      setLevelId([...levelId, levelIdToAdd])
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      await editStudent.mutateAsync({
        studentFirstName: data.firstName as string,
        studentLastName: data.lastName as string,
        studentDateOfBirth: data.dateOfBirth as string,
        userId: data.teacher,
        status: data.status,
        id: currentStudent.id as string,
        levelId: levelId,
        existingLevelIds: getExistingLevelIds(),
      })
    } catch (error) {
      console.error("Failed to edit student:", {
        error,
        studentId: currentStudent.id,
        formData: data,
      })
    }
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

      <div className="mb-4">
        <label className="py-0 label">
          <span className="label-text">Teacher</span>
        </label>
        <select
          className="w-full select select-bordered"
          {...register("teacher")}
        >
          <option disabled selected value={currentStudent.teacher?.id}>
            {currentStudent.teacher?.name}
          </option>
          {teachers?.map((teacher) => (
            <option value={teacher.id} key={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="py-0 label">
          <span className="label-text">Status</span>
        </label>
        <select
          className="w-full select select-bordered"
          {...register("status")}
        >
          <option disabled selected value={currentStudent.status}>
            {currentStudent.status}
          </option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="py-0 label">
          <span className="label-text">Levels Assigned</span>
        </label>
        <fieldset>
          <div className="space-y-1">
            {getLevels.data?.map((level) => (
              <div key={level.id} className="relative flex items-start">
                <div className="flex items-center h-6">
                  <input
                    id={level.id}
                    aria-describedby={`${level.id}-description`}
                    name="level"
                    type="checkbox"
                    value={
                      getExistingLevelIds().length > 0 && levelId.length === 0
                        ? getExistingLevelIds()
                        : levelId
                    }
                    onChange={() => handleCheckboxChange(level.id)}
                    defaultChecked={getExistingLevelIds().includes(level.id)}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label
                    htmlFor={level.id}
                    className="font-medium text-neutral-900"
                  >
                    Level {level.number}
                  </label>{" "}
                  <span
                    id={`${level.id}-description`}
                    className="text-neutral-500"
                  >
                    - {level.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      <ButtonLegacy
        type="submit"
        intent="primary"
        size="medium"
        fullWidth
        className="my-2"
        loading={editStudent.isLoading}
        loadingLabel="Saving..."
      >
        Save
      </ButtonLegacy>
    </form>
  )
}
