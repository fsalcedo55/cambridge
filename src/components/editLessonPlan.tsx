import { useForm } from "react-hook-form"
import { FormInput } from "./ui/form/form-input"
import { Button } from "./ui/button"
import { trpc } from "@src/utils/trpc"

export type FormFields = {
  title: string
  date: string
}

interface Props {
  currentLessonPlan: any
  closeModal: () => void
}

export default function EditLessonPlan({
  currentLessonPlan,
  closeModal,
}: Props) {
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
      })
    } catch (error) {}
    closeModal()
  })

  console.log("ref currentlessonplan in edit: ", currentLessonPlan)

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

      <Button
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loading={editLessonPlan.isLoading}
        loadingLabel="Saving..."
        fullWidth
      >
        Save
      </Button>
    </form>
  )
}
