import React, { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { ButtonLegacy } from "@ui/buttonLegacy"
import { trpc } from "@src/utils/trpc"

export type AddStudentFormValues = {
  studentFirstName: string
  studentLastName: string
  studentDateOfBirth: string
  teacher: string
  status: string
  levelId: string[]
}

interface Props {
  teachers?: {
    id: string
    name: string
  }[]
  handleSubmit: (values: AddStudentFormValues) => Promise<void>
  btnLoading: boolean
  btnLabel: string
}

export default function AddStudent({
  teachers,
  handleSubmit,
  btnLoading,
  btnLabel,
}: Props) {
  const [levelId, setLevelId] = useState<string[]>([])
  const getLevels = trpc.level.getLevelsReduced.useQuery()

  const handleLevelCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value

    if (e.target.checked) {
      setLevelId([...levelId, value])
    } else {
      setLevelId((prevLevels) => prevLevels.filter((level) => level !== value))
    }
  }

  const formik = useFormik({
    initialValues: {
      studentFirstName: "",
      studentLastName: "",
      studentDateOfBirth: "",
      teacher: "",
      status: "",
      levelId: [] as string[],
    },
    validationSchema: Yup.object({
      studentFirstName: Yup.string()
        .max(20, "Must be 20 characters or less.")
        .required("Required"),
      studentLastName: Yup.string()
        .max(20, "Must be 20 characters or less.")
        .required("Required"),
      studentDateOfBirth: Yup.string().required("Required"),
      teacher: Yup.string().required("Required"),
      status: Yup.string().required("Required"),
      levelId: Yup.array(Yup.string()),
    }),
    onSubmit: async (values) => {
      values.levelId = levelId
      await handleSubmit(values)
    },
  })

  return (
    <div>
      <div>
        <form className="flex flex-col" onSubmit={formik.handleSubmit}>
          <label htmlFor="studentFirstName">First Name</label>
          <input
            id="studentFirstName"
            name="studentFirstName"
            type="text"
            className="w-full max-w-md mb-1 input input-bordered"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.studentFirstName}
          />
          <div className="h-6">
            {formik.touched.studentFirstName &&
            formik.errors.studentFirstName ? (
              <div className="text-xs text-error">
                {formik.errors.studentFirstName}
              </div>
            ) : null}
          </div>

          <label htmlFor="studentLastName">Last Name</label>
          <input
            id="studentLastName"
            name="studentLastName"
            type="text"
            className="w-full max-w-md mb-2 input input-bordered"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.studentLastName}
          />
          <div className="h-6">
            {formik.touched.studentLastName && formik.errors.studentLastName ? (
              <div className="text-xs text-error">
                {formik.errors.studentLastName}
              </div>
            ) : null}
          </div>

          <label htmlFor="studentDateOfBirth">Date of Birth</label>
          <input
            id="studentDateOfBirth"
            name="studentDateOfBirth"
            type="date"
            className="w-full max-w-md mb-2 input input-bordered"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.studentDateOfBirth}
          />
          <div className="h-6">
            {formik.touched.studentDateOfBirth &&
            formik.errors.studentDateOfBirth ? (
              <div className="text-xs text-error">
                {formik.errors.studentDateOfBirth}
              </div>
            ) : null}
          </div>

          <label htmlFor="teacher">Assign a Teacher</label>

          <select
            id="teacher"
            name="teacher"
            className="w-full max-w-md select select-bordered"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.teacher}
          >
            <option value="">Teacher</option>
            {teachers?.map((teacher) => (
              <option value={teacher.id} key={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
          <div className="h-6">
            {formik.touched.teacher && formik.errors.teacher ? (
              <div className="text-xs text-error">{formik.errors.teacher}</div>
            ) : null}
          </div>

          <label htmlFor="status">Status</label>

          <select
            id="status"
            name="status"
            className="w-full max-w-md select select-bordered"
            defaultValue=""
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.status}
          >
            <option value=""></option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="h-6">
            {formik.touched.status && formik.errors.status ? (
              <div className="text-xs text-error">{formik.errors.status}</div>
            ) : null}
          </div>

          <div className="mb-2">
            <label className="py-0 label">
              <span>Assign Levels</span>
            </label>
            <fieldset>
              <legend className="sr-only">Plan</legend>
              <div className="space-y-1">
                {getLevels.data?.map((level) => (
                  <div key={level.id} className="relative flex items-start">
                    <div className="flex items-center h-6">
                      <input
                        checked={levelId.includes(level.id)}
                        id={level.id}
                        aria-describedby={`${level.id}-description`}
                        name="level"
                        type="checkbox"
                        value={level.id}
                        onChange={handleLevelCheckboxChange}
                        // defaultChecked={level.id === "small"}
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
            className="max-w-md my-2"
            intent="primary"
            size="medium"
            loading={btnLoading}
            loadingLabel={btnLabel}
          >
            + Add Student
          </ButtonLegacy>
        </form>
      </div>
    </div>
  )
}
