import { useForm } from "react-hook-form"
import { FormInput } from "@ui/form/form-input"
import { ButtonLegacy } from "@src/components/ui/button"
import { trpc } from "@src/utils/trpc"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export type FormFields = {
  title: string
  url: string
}

interface Props {
  currentLesson: any
  closeModal: () => void
}

export default function AddAssignment({ closeModal, currentLesson }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()
  const addAssignment = trpc.assignment.add.useMutation()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addAssignment.mutateAsync({
        title: data.title,
        url: data.url,
        lessonId: currentLesson.data?.id,
      })
    } catch (error) {
      console.log("Error adding assignment.", error)
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
        id="url"
        type="text"
        name="url"
        label="URL"
        register={register}
        rules={{ required: "You must enter a URL." }}
        errors={errors}
      />
      <ButtonLegacy
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loadingLabel="Adding..."
        loading={addAssignment.isLoading}
        fullWidth
      >
        Add Assignment
      </ButtonLegacy>
    </form>
  )
}
