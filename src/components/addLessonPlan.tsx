import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@ui/button"
import { ILessonPlan, Student } from "@src/interfaces"
import { Switch } from "@headlessui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "./ui/form/form-input"
import { trpc } from "@src/utils/trpc"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export type FormFields = {
  title: string
  slidesUrl: string
  date: string
  homeworkSent: boolean
}

interface Values {
  title: string
  slidesUrl: string
  date: string
  homeworkSent: boolean
}

interface Props {
  studentId: string | undefined
  teacherId: string | undefined
  closeModal: () => void
}

export default function AddLessonPlan({
  studentId,
  teacherId,
  closeModal,
}: Props) {
  const [hmwrkSent, setHmwrkSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()
  const addLessonPlan = trpc.lessonPlan.add.useMutation()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addLessonPlan.mutateAsync({
        title: data.title,
        date: data.date,
        studentId: studentId as string,
        userId: teacherId as string,
        slidesUrl: data.slidesUrl,
        homeworkSent: hmwrkSent,
      })
    } catch (error) {
      console.log(error)
    }
    closeModal()
  })

  return (
    <form onSubmit={onSubmit}>
      <FormInput
        id="title"
        type="text"
        name="title"
        label="Title"
        register={register}
        rules={{ required: "You must enter a title." }}
        errors={errors}
      />
      <FormInput
        id="date"
        type="date"
        name="date"
        label="Date"
        register={register}
        rules={{ required: "You must enter a date." }}
        errors={errors}
      />
      <FormInput
        id="slidesUrl"
        type="text"
        name="slidesUrl"
        label="Link"
        register={register}
        errors={errors}
      />
      <Switch.Group as="div" className="flex items-center mb-1">
        <Switch.Label as="span" className="mr-3">
          <span className="text-sm font-medium text-gray-900">
            Homework Sent?
          </span>
        </Switch.Label>
        <Switch
          checked={hmwrkSent}
          onChange={setHmwrkSent}
          className={classNames(
            hmwrkSent ? "bg-accent-500" : "bg-neutral-200",
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              hmwrkSent ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            )}
          />
        </Switch>
      </Switch.Group>
      <Button
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loadingLabel="Saving..."
        loading={addLessonPlan.isLoading}
        fullWidth
      >
        Save
      </Button>
    </form>
  )
}

// export default function AddLessonPlan({
//   handleSubmit,
//   btnLoading,
//   btnLabel,
// }: Props) {
//   const [hmwrkSent, sethmwrkSent] = useState(false)

//   const formik = useFormik({
//     initialValues: {
//       title: "",
//       date: "",
//       slidesUrl: "",
//       homeworkSent: hmwrkSent,
//     },
//     validationSchema: Yup.object({
//       title: Yup.string()
//         .max(50, "Must be 50 characters or less")
//         .required("Required"),
//       date: Yup.string().required("Required"),
//       slidesUrl: Yup.string(),
//       homeworkSent: Yup.boolean(),
//     }),
//     onSubmit: (values, actions) => {
//       handleSubmit(values)
//     },
//   })

//   return (
//     <div>
//       <form className="flex flex-col" onSubmit={formik.handleSubmit}>
//         <label>Title</label>
//         <input
//           id="title"
//           name="title"
//           type="text"
//           className="w-full max-w-md mb-1 input input-bordered"
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values.title}
//         />
//         <div className="h-6">
//           {formik.touched.title && formik.errors.title ? (
//             <div className="text-xs text-error">{formik.errors.title}</div>
//           ) : null}
//         </div>
//         <label>When did the class take place?</label>
//         <input
//           id="date"
//           name="date"
//           type="date"
//           className="w-full max-w-md mb-2 input input-bordered"
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values.date}
//         />
//         <div className="h-6">
//           {formik.touched.date && formik.errors.date ? (
//             <div className="text-xs text-error">{formik.errors.date}</div>
//           ) : null}
//         </div>

//         <label>Link</label>
//         <input
//           id="slidesUrl"
//           name="slidesUrl"
//           type="text"
//           className="w-full max-w-md mb-1 input input-bordered"
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values.slidesUrl}
//         />
//         <div className="h-6">
//           {formik.touched.slidesUrl && formik.errors.slidesUrl ? (
//             <div className="text-xs text-error">{formik.errors.slidesUrl}</div>
//           ) : null}
//         </div>

//         <Switch.Group as="div" className="flex items-center mb-1">
//           <Switch.Label as="span" className="mr-3">
//             <span className="text-sm font-medium text-gray-900">
//               Homework Sent?
//             </span>
//           </Switch.Label>
//           <Switch
//             checked={hmwrkSent}
//             onChange={sethmwrkSent}
//             className={classNames(
//               hmwrkSent ? "bg-accent-500" : "bg-neutral-200",
//               "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//             )}
//           >
//             <span
//               aria-hidden="true"
//               className={classNames(
//                 hmwrkSent ? "translate-x-5" : "translate-x-0",
//                 "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
//               )}
//             />
//           </Switch>
//         </Switch.Group>

//         <Button
//           type="submit"
//           className="max-w-md my-2"
//           intent="primary"
//           size="medium"
//           loading={btnLoading}
//           loadingLabel={btnLabel}
//         >
//           Add Lesson Plan
//         </Button>
//       </form>
//     </div>
//   )
// }
