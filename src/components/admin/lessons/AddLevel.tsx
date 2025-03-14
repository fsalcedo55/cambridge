import { ButtonLegacy } from "@ui/buttonLegacy"
import { useForm } from "react-hook-form"
import { FormInput } from "@ui/form/form-input"
import { trpc } from "@src/utils/trpc"
import { toast } from "sonner"

export type FormFields = {
  title: string
  number: number
}

interface Props {
  closeModal: () => void
}

export default function AddLevel({ closeModal }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()
  const addLevel = trpc.level.add.useMutation()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addLevel.mutateAsync({
        title: data.title,
        number: Number(data.number),
      })
      toast.success("Level added successfully")
    } catch (error) {
      toast.error("Failed to add level")
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
        id="number"
        type="number"
        name="number"
        label="Number"
        register={register}
        rules={{ required: "You must enter a number." }}
        errors={errors}
      />

      <ButtonLegacy
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loadingLabel="Adding..."
        loading={addLevel.isLoading}
        fullWidth
      >
        Add
      </ButtonLegacy>
    </form>
  )
}
