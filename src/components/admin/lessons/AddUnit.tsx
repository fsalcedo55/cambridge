import { Button } from "@ui/button"
import { useForm } from "react-hook-form"
import { FormInput } from "@ui/form/form-input"
import { trpc } from "@src/utils/trpc"
import { useEffect } from "react"
import { ErrorMessage } from "@hookform/error-message"
import Link from "next/link"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export type FormFields = {
  title: string
  number: number
  levelId: string
  photoUrl: string
}

interface Props {
  closeModal: () => void
  levelsArray: any
}

export default function AddUnit({ closeModal, levelsArray }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()
  const addUnit = trpc.unit.add.useMutation()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addUnit.mutateAsync({
        title: data.title,
        number: Number(data.number),
        levelId: data.levelId,
        photoUrl: data.photoUrl,
      })
    } catch (error) {
      console.log(error)
    }
    closeModal()
  })

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
          <option disabled selected value="" />

          {levelsArray?.map((level: any) => (
            <option value={level.id} key={level.id}>
              {level.number}: {level.title}
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
      />
      <FormInput
        id="photoUrl"
        type="text"
        name="photoUrl"
        label={
          <div>
            Photo URL{" "}
            <Link
              href="https://unsplash.com/"
              className="cursor-pointer text-primary-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              (Unsplash)
            </Link>
          </div>
        }
        register={register}
        rules={{ required: "You must enter a photo URL." }}
        errors={errors}
      />
      <FormInput
        id="number"
        type="number"
        name="number"
        label="Unit Number"
        register={register}
        rules={{ required: "You must enter a number." }}
        errors={errors}
      />

      <Button
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loadingLabel="Adding..."
        loading={addUnit.isLoading}
        fullWidth
      >
        Add
      </Button>
    </form>
  )
}
