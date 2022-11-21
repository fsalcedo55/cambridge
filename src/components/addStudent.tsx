import { useFormik } from "formik"
import { useState } from "react"
import Loading from "./ui/loading"
import * as Yup from "yup"
import { Button } from "@ui/button"

interface Values {
  studentFirstName: string
  studentLastName: string
  studentDateOfBirth: string
  teacher: any
}

interface Props {
  teachers?: any[]
  handleSubmit: any
  btnLoading: boolean
  btnLabel: string
}

export default function AddStudent({
  teachers,
  handleSubmit,
  btnLoading,
  btnLabel,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [defaultValueState, setDefaultValueState] = useState("default")

  const formik = useFormik({
    initialValues: {
      studentFirstName: "",
      studentLastName: "",
      studentDateOfBirth: "",
      teacher: "",
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
    }),
    onSubmit: (values, actions) => {
      handleSubmit(values)
    },
  })

  return (
    <div>
      <div>
        {isLoading ? (
          <Loading />
        ) : (
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
              {formik.touched.studentLastName &&
              formik.errors.studentLastName ? (
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
              name="teacher"
              className="w-full max-w-md select select-bordered"
              defaultValue={defaultValueState}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.teacher}
            >
              <option value={defaultValueState}>Assign a Teacher</option>
              {teachers?.map((teacher) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            <div className="h-6">
              {formik.touched.teacher && formik.errors.teacher ? (
                <div className="text-xs text-error">
                  {formik.errors.teacher}
                </div>
              ) : null}
            </div>

            <Button
              type="submit"
              className="max-w-md my-2"
              intent="primary"
              size="medium"
              loading={btnLoading}
              loadingLabel={btnLabel}
            >
              + Add Student
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
