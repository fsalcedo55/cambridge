import { useForm } from "react-hook-form"
import { FormInput } from "@ui/form/form-input"
import { ButtonLegacy } from "@ui/buttonLegacy"
import { trpc } from "@src/utils/trpc"
import { Switch } from "@headlessui/react"
import { Fragment, useState } from "react"
import { useSession } from "next-auth/react"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export type FormFields = {
  title: string
  published: boolean
  number: number
}

interface Props {
  currentLevel: any
  closeModal: () => void
}

export default function EditLevel({ closeModal, currentLevel }: Props) {
  const { data: session } = useSession()
  const [published, setPublished] = useState(currentLevel?.published)
  const editLevel = trpc.level.edit.useMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await editLevel.mutateAsync({
        title: data.title,
        id: currentLevel.id,
        published: published,
        number: Number(data.number),
      })
    } catch (error) {
      console.log("Error editing level.", error)
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
        defaultValue={currentLevel?.title}
      />

      <FormInput
        id="number"
        type="number"
        name="number"
        label="Number"
        register={register}
        errors={errors}
        defaultValue={currentLevel?.number}
      />

      {session?.role === "admin" && (
        <Switch.Group as="div" className="flex items-center mb-1">
          <Switch.Label as="span" className="mr-3">
            <span className="text-sm font-medium text-gray-900">
              Publish Level
            </span>
          </Switch.Label>
          <Switch
            defaultChecked={currentLevel?.published}
            onChange={setPublished}
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
        loading={editLevel.isLoading}
        loadingLabel="Saving..."
        fullWidth
      >
        Save
      </ButtonLegacy>
    </form>
  )
}
