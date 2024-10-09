import { useForm } from "react-hook-form"
import { FormInput } from "./ui/form/form-input"
import { ButtonLegacy } from "./ui/buttonLegacy"
import { trpc } from "@src/utils/trpc"
import { Switch } from "@headlessui/react"
import { Fragment, useState } from "react"
import { useSession } from "next-auth/react"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export type FormFields = {
  title: string
  date: string
  slidesUrl: string
  homeworkSent: boolean
}

interface Props {
  currentLessonPlan: any
  closeModal: () => void
}

export default function EditLessonPlan({
  currentLessonPlan,
  closeModal,
}: Props) {
  const { data: session } = useSession()
  const [hmwrkSent, sethmwrkSent] = useState(currentLessonPlan?.homeworkSent)
  const editLessonPlan = trpc.lessonPlan.edit.useMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await editLessonPlan.mutateAsync({
        title: data.title,
        date: data.date,
        id: currentLessonPlan.id,
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
        defaultValue={currentLessonPlan?.title}
      />
      <FormInput
        id="date"
        type="date"
        name="date"
        label="Date"
        register={register}
        rules={{ required: "You must enter a date." }}
        errors={errors}
        defaultValue={currentLessonPlan?.date}
      />
      <FormInput
        id="slidesUrl"
        type="text"
        name="slidesUrl"
        label="Link"
        register={register}
        errors={errors}
        defaultValue={currentLessonPlan?.slidesUrl}
      />

      {session?.role === "admin" && (
        <Switch.Group as="div" className="flex items-center mb-1">
          <Switch.Label as="span" className="mr-3">
            <span className="text-sm font-medium text-gray-900">
              Homework Sent?
            </span>
          </Switch.Label>
          <Switch
            defaultChecked={currentLessonPlan?.homeworkSent}
            onChange={sethmwrkSent}
            as={Fragment}
          >
            {({ checked }) => (
              <button
                className={classNames(
                  checked ? "bg-accent-500" : "bg-neutral-200",
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    checked ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  )}
                />
              </button>
            )}
          </Switch>
        </Switch.Group>
      )}

      <ButtonLegacy
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loading={editLessonPlan.isLoading}
        loadingLabel="Saving..."
        fullWidth
      >
        Save
      </ButtonLegacy>
    </form>
  )
}
