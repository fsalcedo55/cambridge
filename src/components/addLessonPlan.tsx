import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@ui/button"

interface Values {
  title: string
  date: string
}

interface Props {
  handleSubmit: any
  btnLoading: boolean
  btnLabel: string
}

export default function AddLessonPlan({
  handleSubmit,
  btnLoading,
  btnLabel,
}: Props) {
  const formik = useFormik({
    initialValues: {
      title: "",
      date: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      date: Yup.string().required("Required"),
    }),
    onSubmit: (values, actions) => {
      console.log(values, actions)
      handleSubmit(values)
    },
  })

  return (
    <div>
      <form className="flex flex-col" onSubmit={formik.handleSubmit}>
        <label>Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className="w-full max-w-md mb-1 input input-bordered"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
        />
        <div className="h-6">
          {formik.touched.title && formik.errors.title ? (
            <p className="text-xs text-error">{formik.errors.title}</p>
          ) : null}
        </div>
        <label>When did the class take place?</label>
        <input
          id="date"
          name="date"
          type="date"
          className="w-full max-w-md mb-2 input input-bordered"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.date}
        />
        <div className="h-6">
          {formik.touched.date && formik.errors.date ? (
            <p className="text-xs text-error">{formik.errors.date}</p>
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
          Add Lesson Plan
        </Button>
      </form>
    </div>
  )
}
