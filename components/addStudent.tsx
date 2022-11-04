import { useFormik } from "formik"
import { useState } from "react"
import Loading from "./loading"
import * as Yup from "yup"

interface Values {
  studentFirstName: string
  studentLastName: string
  studentDateOfBirth: string
  teacher: any
}

interface Props {
  teachers: any[]
  handleSubmit: any
}

export default function AddStudent({ teachers, handleSubmit }: Props) {
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
      console.log("values, actions: ", values, actions)
      handleSubmit(values)
    },
  })

  console.log(formik.errors)

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
              className="w-full max-w-xs mb-1 input input-bordered"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.studentFirstName}
            />
            <div className="h-6">
              {formik.touched.studentFirstName &&
              formik.errors.studentFirstName ? (
                <p className="text-xs text-error">
                  {formik.errors.studentFirstName}
                </p>
              ) : null}
            </div>

            <label htmlFor="studentLastName">Last Name</label>
            <input
              id="studentLastName"
              name="studentLastName"
              type="text"
              className="w-full max-w-xs mb-2 input input-bordered"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.studentLastName}
            />
            <div className="h-6">
              {formik.touched.studentLastName &&
              formik.errors.studentLastName ? (
                <p className="text-xs text-error">
                  {formik.errors.studentLastName}
                </p>
              ) : null}
            </div>

            <label htmlFor="studentDateOfBirth">Date of Birth</label>
            <input
              id="studentDateOfBirth"
              name="studentDateOfBirth"
              type="date"
              className="w-full max-w-xs mb-2 input input-bordered"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.studentDateOfBirth}
            />
            <div className="h-6">
              {formik.touched.studentDateOfBirth &&
              formik.errors.studentDateOfBirth ? (
                <p className="text-xs text-error">
                  {formik.errors.studentDateOfBirth}
                </p>
              ) : null}
            </div>

            <label htmlFor="teacher">Assign a Teacher</label>

            <select
              name="teacher"
              className="w-full max-w-xs select select-bordered"
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
                <p className="text-xs text-error">{formik.errors.teacher}</p>
              ) : null}
            </div>

            <button type="submit" className="max-w-xs my-4 btn btn-primary">
              Add Student
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
