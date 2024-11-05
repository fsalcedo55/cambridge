import { useForm } from "react-hook-form"
import { FormInput } from "@ui/form/form-input"
import { ButtonLegacy } from "@src/components/ui/buttonLegacy"
import { trpc } from "@src/utils/trpc"
import { toast } from "sonner"

export type FormFields = {
  title: string
  url: string
}

interface Props {
  currentLesson: {
    data?: {
      id: string | number
      Unit?: {
        number: number
        Level?: {
          number: number
          id: string
          title: string
        }
        id: string
        title: string
        published: boolean
      }
      title: string
      published: boolean
      slidesUrl: string | null
      photoUrl: string
      objective: string | null
    } | null
  }
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
        lessonId: String(currentLesson.data?.id),
      })
      toast.success("Assignment added successfully")
    } catch (error) {
      toast.error("Failed to add assignment")
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
