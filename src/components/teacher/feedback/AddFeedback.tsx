import { useState } from "react"
import { RadioGroup } from "@headlessui/react"
import { IoMdInformationCircleOutline } from "react-icons/io"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useForm } from "react-hook-form"
import { Button } from "@src/components/ui/button"

export type FormFields = {
  feedback: string
}

export default function AddFeedback() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()
  const onSubmit = () => {
    console.log("submitted...")
  }

  const metrics = [
    {
      id: 1,
      label: "Attitude",
      description:
        "Actitud: Evaluar el entusiasmo, cooperación y persistencia del estudiante en actividades de aprendizaje.",
    },
    {
      id: 2,
      label: "Grammar",
      description:
        "Gramática: Evaluar la precisión y aplicación de reglas gramaticales tanto en español hablado como escrito.",
    },
    {
      id: 3,
      label: "Speaking",
      description:
        "Habla: Observar la fluidez, pronunciación y capacidad del estudiante para participar en conversaciones en español.",
    },
    {
      id: 4,
      label: "Reading",
      description:
        "Lectura: Determinar la comprensión e interpretación del estudiante de textos escritos en español.",
    },
    {
      id: 5,
      label: "Writing",
      description:
        "Escritura: Evaluar la coherencia, gramática y creatividad en los trabajos escritos del estudiante.",
    },
    {
      id: 6,
      label: "Vocabulary",
      description:
        "Vocabulario: Evaluar la amplitud y adecuación del vocabulario del estudiante en diversos contextos.",
    },
  ]

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4 mb-2">
        <div className="flex flex-col gap-4">
          {metrics.map((metric) => (
            <RadioButton
              label={metric.label}
              key={metric.id}
              description={metric.description}
            />
          ))}
        </div>
      </div>

      <div className="my-8">
        <label
          htmlFor="objective"
          className="block text-sm font-medium text-gray-700"
        >
          General
        </label>
        <div className="mb-2">
          <textarea
            rows={5}
            id="objective"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            // defaultValue="write"
            {...register("feedback", {})}
          />
        </div>
      </div>

      <Button
        type="submit"
        intent="primary"
        size="medium"
        className="my-2"
        loadingLabel="Saving..."
        fullWidth
      >
        Submit Feedback
      </Button>
    </form>
  )
}

const performanceLevels = [
  {
    id: 1,
    title: "Needs Work",
  },
  {
    id: 2,
    title: "Normal",
  },
  {
    id: 3,
    title: "Great",
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

interface RadioButtonProps {
  label: string
  description: string
}

function RadioButton({ label, description }: RadioButtonProps) {
  const [selectedPerformanceLevels, setSelectedPerformanceLevels] = useState(
    performanceLevels[1]
  )

  return (
    <RadioGroup
      value={selectedPerformanceLevels}
      onChange={setSelectedPerformanceLevels}
      className="flex items-center justify-between"
    >
      <RadioGroup.Label className="flex items-center gap-1 text-sm font-semibold text-neutral-900">
        {label}{" "}
        <span title={description}>
          <IoMdInformationCircleOutline />
        </span>
      </RadioGroup.Label>

      <div className="grid grid-cols-1 sm:grid-cols-3">
        {performanceLevels.map((mailingList) => (
          <RadioGroup.Option
            key={mailingList.id}
            value={mailingList}
            className={({ checked, active }) =>
              classNames(
                active ? "border-primary-600" : "border-neutral-100",
                checked ? "bg-primary-500" : "bg-white",
                "transition-all duration-300 flex cursor-pointer border p-2 shadow first:rounded-l-full last:rounded-r-full focus:outline-none focus:z-50 focus:ring focus:ring-primary-300"
              )
            }
          >
            {({ checked, active }) => (
              <span className="flex justify-center flex-1">
                <span className="flex flex-col">
                  <RadioGroup.Label
                    as="span"
                    className={classNames(
                      checked ? "text-white" : "text-neutral-900 font-medium",
                      "block text-xs"
                    )}
                  >
                    {mailingList.title}
                  </RadioGroup.Label>
                </span>
              </span>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}
