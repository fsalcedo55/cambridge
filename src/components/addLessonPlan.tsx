import { ButtonLegacy } from "@ui/buttonLegacy"
import { Switch } from "@headlessui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "./ui/form/form-input"
import { trpc } from "@src/utils/trpc"
import { useSession } from "next-auth/react"
import { notifyNewLessonPlan } from "@src/lib/knockApi"
import { toast } from "sonner"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export type FormFields = {
  title: string
  slidesUrl: string
  date: string
  homeworkSent: boolean
}

interface Props {
  studentId: string | undefined
  teacherId: string | undefined
  closeModal: () => void
  actorId: string
  recipientId: string
  studentName: string | undefined
  actionUrl: string | undefined
}

export default function AddLessonPlan({
  studentId,
  teacherId,
  closeModal,
  actorId,
  recipientId,
  studentName,
  actionUrl,
}: Props) {
  const { data: session } = useSession()
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
      await notifyNewLessonPlan({
        recipientId,
        actorId,
        studentName,
        lessonName: data.title,
        actionUrl,
      })
    } catch (error) {
      toast.error("Failed to add lesson plan. Please try again.")
      return
    }
    toast.success("Lesson plan added successfully!")
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

      {session?.role === "admin" && (
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
      )}
      <ButtonLegacy
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loadingLabel="Saving..."
        loading={addLessonPlan.isLoading}
        fullWidth
      >
        Save
      </ButtonLegacy>
    </form>
  )
}
