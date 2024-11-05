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
  currentAssignment: {
    id: string | number
    title: string
    url: string
  }
  closeModal: () => void
}

export default function EditAssignment({
  closeModal,
  currentAssignment,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()
  const editAssignment = trpc.assignment.edit.useMutation()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await editAssignment.mutateAsync({
        title: data.title,
        url: data.url,
        id: String(currentAssignment.id),
      })
      toast.success("Assignment updated successfully")
    } catch (error) {
      toast.error("Failed to update assignment")
    }
    closeModal()
  })

  return (
    <form onSubmit={onSubmit}>
      <FormInput<FormFields>
        id="title"
        type="text"
        name="title"
        label="Title"
        register={register}
        rules={{ required: "You must enter a title." }}
        errors={errors}
        defaultValue={currentAssignment.title}
      />
      <FormInput<FormFields>
        id="url"
        type="text"
        name="url"
        label="URL"
        register={register}
        rules={{ required: "You must enter a URL." }}
        errors={errors}
        defaultValue={currentAssignment.url}
      />
      <ButtonLegacy
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loadingLabel="Updating..."
        loading={editAssignment.isLoading}
        fullWidth
      >
        Update Assignment
      </ButtonLegacy>
    </form>
  )
}
