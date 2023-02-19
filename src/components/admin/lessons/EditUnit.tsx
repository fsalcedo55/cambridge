import { useForm } from "react-hook-form"
import { FormInput } from "@ui/form/form-input"
import { Button } from "@ui/button"
import { trpc } from "@src/utils/trpc"
import { Switch } from "@headlessui/react"
import { Fragment, useState } from "react"
import { useSession } from "next-auth/react"
import { ErrorMessage } from "@hookform/error-message"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export type FormFields = {
  title: string
  photoUrl: string
  published: boolean
  number: number
  levelId: string
}

interface Props {
  levels: any
  currentUnit: any
  closeModal: () => void
}

export default function EditUnit({ closeModal, currentUnit, levels }: Props) {
  const { data: session } = useSession()
  const [published, setPublished] = useState(currentUnit?.published)
  const editUnit = trpc.unit.edit.useMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await editUnit.mutateAsync({
        title: data.title,
        id: currentUnit.id,
        published: published,
        number: Number(data.number),
        photoUrl: data.photoUrl,
        levelId: data.levelId,
      })
    } catch (error) {
      console.log("Error editing level.", error)
    }
    closeModal()
  })

  console.log("currentUnit: ", currentUnit)

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-2">
        <label className="py-0 label">
          <span className="label-text">Level</span>
        </label>
        <select
          className="w-full select select-bordered"
          {...register("levelId", {
            required: "You must enter a level.",
          })}
        >
          <option disabled selected value={currentUnit.Level.id}>
            {currentUnit.Level.title}
          </option>

          {levels?.map((level: any) => (
            <option value={level.id} key={level.id}>
              {level.title}
            </option>
          ))}
        </select>
        <ErrorMessage
          errors={errors}
          name="levelId"
          render={({ message }) => (
            <div className="h-2 label-text-alt text-error">{message}</div>
          )}
        />
      </div>
      <FormInput
        id="title"
        type="text"
        name="title"
        label="Title"
        register={register}
        rules={{ required: "You must enter a title." }}
        errors={errors}
        defaultValue={currentUnit?.title}
      />

      <FormInput
        id="photoUrl"
        type="text"
        name="photoUrl"
        label="PhotoUrl"
        register={register}
        rules={{ required: "You must enter a title." }}
        errors={errors}
        defaultValue={currentUnit?.photoUrl}
      />

      <FormInput
        id="number"
        type="number"
        name="number"
        label="Unit Number"
        register={register}
        errors={errors}
        defaultValue={currentUnit?.number}
      />

      <Switch.Group as="div" className="flex items-center mb-1">
        <Switch.Label as="span" className="mr-3">
          <span className="text-sm font-medium text-gray-900">
            Publish Unit
          </span>
        </Switch.Label>
        <Switch
          defaultChecked={currentUnit?.published}
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

      <Button
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loading={editUnit.isLoading}
        loadingLabel="Saving..."
        fullWidth
      >
        Save
      </Button>
    </form>
  )
}
