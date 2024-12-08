import { useForm } from "react-hook-form"
import { FormInput } from "@ui/form/form-input"
import { ButtonLegacy } from "@ui/buttonLegacy"
import { trpc } from "@src/utils/trpc"
import { Switch } from "@headlessui/react"
import { Fragment, useState } from "react"
import { ErrorMessage } from "@hookform/error-message"
import Link from "next/link"
import { toast } from "sonner"

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
  assignment: string
}

interface Props {
  currentLesson: {
    data: {
      id: string
      title: string
      published: boolean
      number: number
      photoUrl: string
      slidesUrl: string | null
      objective: string | null
      Unit: {
        id: string
        number: number
        title: string
        Level: {
          id: string
          number: number
          title: string
        }
      }
    }
  }
  closeModal: () => void
}

interface LevelData {
  id: string
  number: number
  title: string
  Unit: Array<{
    id: string
  }>
}

interface UnitData {
  id: string
  number: number
  title: string
}

export default function EditLesson({ closeModal, currentLesson }: Props) {
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
    { enabled: typeof levelIdState === "string" }
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
        objective: data.lessonObjective,
      })
      toast.success("Lesson updated successfully")
    } catch (error) {
      toast.error("Error updating lesson")
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

          {levels?.data?.map((level: LevelData) => {
            if (level.Unit?.length > 0) {
              return (
                <option value={level.id} key={level.id}>
                  {`Level ${level.number}: ${level.title}`}
                </option>
              )
            }
            return null
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
            units.data?.map((unit: UnitData) => (
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
        rules={{ required: "You must enter a url." }}
        errors={errors}
        defaultValue={currentLesson?.data?.photoUrl}
      />

      {/* ***** Implement drag and drop in the future ***** */}

      {/* <div className="pb-2">
        <label htmlFor="cover-photo" className="block label-text sm:mt-px">
          Cover photo
        </label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">
          <div className="flex justify-center max-w-lg px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative font-medium rounded-md cursor-pointer text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
      </div> */}

      <FormInput
        id="number"
        type="number"
        name="number"
        label="Lesson Number"
        register={register}
        rules={{ required: "You must enter a number." }}
        errors={errors}
        defaultValue={String(currentLesson?.data?.number)}
      />
      <FormInput
        id="slidesUrl"
        type="text"
        name="slidesUrl"
        label="Slides URL"
        register={register}
        rules={{ required: "You must enter a url." }}
        errors={errors}
        defaultValue={currentLesson.data.slidesUrl ?? undefined}
      />
      <div>
        <label
          htmlFor="objective"
          className="block text-sm font-medium text-gray-700"
        >
          Lesson Objective
        </label>
        <div className="mb-2">
          <textarea
            rows={3}
            // name="objective"
            id="objective"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            defaultValue={currentLesson?.data?.objective ?? undefined}
            {...register("lessonObjective", {})}
          />
        </div>
      </div>

      <Switch.Group as="div" className="flex items-center mb-1">
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
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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

      <ButtonLegacy
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loading={editLesson.isLoading}
        loadingLabel="Saving..."
        fullWidth
      >
        Save
      </ButtonLegacy>
    </form>
  )
}
