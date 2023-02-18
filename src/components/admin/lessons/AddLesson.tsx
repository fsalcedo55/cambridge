import { Button } from "@ui/button"
import { useForm } from "react-hook-form"
import { FormInput } from "@ui/form/form-input"
import { trpc } from "@src/utils/trpc"
import { useEffect, useState } from "react"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export type FormFields = {
  title: string
  number: number
  levelId: string
  unitId: string
  photoUrl: string
}

interface Props {
  closeModal: () => void
  levelsArray: any
}

export default function AddLesson({ closeModal, levelsArray }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()
  //   const [currentLevel, setCurrentLevel] = useState(levelsArray[0])
  const [levelIdState, setLevelIdState] = useState<string>("")
  const addLesson = trpc.lesson.add.useMutation()
  const unitByLevelId = trpc.unit.getById.useQuery({
    levelId: levelIdState as string,
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addLesson.mutateAsync({
        title: data.title,
        number: Number(data.number),
        // levelId: data.levelId,
        unitId: data.unitId,
        photoUrl: data.photoUrl,
      })
    } catch (error) {
      console.log(error)
    }
    closeModal()
  })

  //   useEffect(() => {
  console.log("units: ", unitByLevelId.data)
  console.log("levelid: ", levelIdState)
  //   }, [levelIdState])

  const selectLevel = register("levelId", { required: true })

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-2">
        <label className="py-0 label">
          <span className="label-text">Level</span>
        </label>
        <select
          className="w-full select select-bordered"
          {...selectLevel}
          //   {...register("levelId")}
          onChange={(e) => {
            selectLevel.onChange(e)
            setLevelIdState(e.target.value)
            console.log("e: ", e.target.value)
          }}
        >
          <option disabled selected value="" />
          {levelsArray?.map((level: any) => (
            <option value={level.id} key={level.id}>
              {level.title}
            </option>
          ))}
        </select>
      </div>

      {levelIdState && (
        <div className="mb-2">
          <label className="py-0 label">
            <span className="label-text">Unit</span>
          </label>
          <select
            className="w-full select select-bordered"
            {...register("unitId")}
          >
            <option disabled selected value="" />
            {unitByLevelId.data?.map((unit: any) => (
              <option value={unit.id} key={unit.id}>
                {unit.title}
              </option>
            ))}
          </select>
        </div>
      )}

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
        label="Photo URL"
        register={register}
        rules={{ required: "You must enter a photo URL." }}
        errors={errors}
      />
      <FormInput
        id="number"
        type="number"
        name="number"
        label="Lesson Number"
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
        loading={addLesson.isLoading}
        fullWidth
      >
        Add
      </Button>
    </form>
  )
}