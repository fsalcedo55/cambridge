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
  slidesUrl: string
  lessonObjective: string
  published: boolean
  number: number
  levelId: string
  unitId: string
}

interface Props {
  currentLesson: any
  closeModal: () => void
}

export default function EditLesson({ closeModal, currentLesson }: Props) {
  const { data: session } = useSession()
  const [published, setPublished] = useState(currentLesson?.data?.published)
  const [levelIdState, setLevelIdState] = useState<string>(
    currentLesson?.data?.Unit?.Level?.id
  )
  const [unitIdState, setUnitIdState] = useState<string>(
    currentLesson?.data?.Unit?.id
  )
  const editLesson = trpc.lesson.edit.useMutation()
  const levels = trpc.level.getLevelsReduced.useQuery()
  const units = trpc.unit.getById.useQuery(
    { levelId: levelIdState },
    { enabled: typeof levelIdState == "string" }
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await editLesson.mutateAsync({
        title: data.title,
        id: currentLesson.data?.id,
        published: published,
        number: Number(data.number),
        photoUrl: data.photoUrl,
        unitId: unitIdState,
        slidesUrl: data.slidesUrl,
      })
    } catch (error) {
      console.log("Error editing lesson.", error)
    }
    closeModal()
  })

  const selectLevel = register("levelId", {
    required: "You must enter a level.",
  })

  const selectUnit = register("unitId", {
    required: "You must enter a unit.",
  })

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-2">
        <label className="py-0 label">
          <span className="label-text">Level</span>
        </label>
        <select
          className="w-full select select-bordered"
          {...selectLevel}
          onChange={(e) => {
            selectLevel.onChange(e)
            setLevelIdState(e.target.value)
          }}
        >
          <option
            disabled
            selected
            value={currentLesson?.data?.Unit?.Level?.id}
          >
            {`Level ${currentLesson?.data?.Unit?.Level?.number}: ${currentLesson?.data?.Unit?.Level?.title}`}
          </option>

          {levels?.data?.map((level: any) => {
            if (level.Unit?.length > 0) {
              return (
                <option value={level.id} key={level.id}>
                  {`Level ${level.number}: ${level.title}`}
                </option>
              )
            }
          })}
        </select>

        <ErrorMessage
          errors={errors}
          name="levelId"
          render={({ message }) => (
            <div className="h-2 label-text-alt text-error">{message}</div>
          )}
        />
      </div>

      <div className="mb-2">
        <label className="py-0 label">
          <span className="label-text">Unit</span>
        </label>
        <select
          className="w-full select select-bordered"
          {...selectUnit}
          onChange={(e) => {
            selectUnit.onChange(e)
            setUnitIdState(e.target.value)
          }}
        >
          <option
            disabled
            selected
            value={currentLesson.data.Unit.id}
          >{`Unit ${currentLesson?.data?.Unit?.number}: ${currentLesson?.data?.Unit?.title}`}</option>
          {units &&
            units.data?.map((unit: any) => (
              <option value={unit.id} key={unit.id}>
                {`Unit ${unit.number}: ${unit.title}`}
              </option>
            ))}
        </select>
        <ErrorMessage
          errors={errors}
          name="unitId"
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
        defaultValue={currentLesson?.data?.title}
      />

      <FormInput
        id="photoUrl"
        type="text"
        name="photoUrl"
        label="Photo URL"
        register={register}
        rules={{ required: "You must enter a url." }}
        errors={errors}
        defaultValue={currentLesson?.data?.photoUrl}
      />
      <FormInput
        id="number"
        type="number"
        name="number"
        label="Unit Number"
        register={register}
        errors={errors}
        defaultValue={currentLesson?.data?.number}
      />
      <FormInput
        id="slidesUrl"
        type="text"
        name="slidesUrl"
        label="Slides URL"
        register={register}
        rules={{ required: "You must enter a url." }}
        errors={errors}
        defaultValue={currentLesson?.data?.slidesUrl}
      />
      {/* <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700"
        >
          Lesson Objective
        </label>
        <div className="mb-2">
          <textarea
            rows={3}
            name="comment"
            id="comment"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            defaultValue={""}
          />
        </div>
      </div>
      <div>
        <label className="py-0 label">
          <span className="label-text">Assignments</span>
        </label>
        <FormInput
          id="assignments"
          type="text"
          name="assignments"
          //   register={register}
          //   rules={{ required: "You must enter a title." }}
          errors={errors}
          defaultValue={currentLesson?.data?.assignments}
        />
      </div> */}

      {/* <Switch.Group as="div" className="flex items-center mb-1">
        <Switch.Label as="span" className="mr-3">
          <span className="text-sm font-medium text-gray-900">
            Publish Lesson
          </span>
        </Switch.Label>
        <Switch
          defaultChecked={currentLesson?.data?.published}
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
      </Switch.Group> */}

      <Button
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loading={editLesson.isLoading}
        loadingLabel="Saving..."
        fullWidth
      >
        Save
      </Button>
    </form>
  )
}
