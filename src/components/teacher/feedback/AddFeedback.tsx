import { useState } from "react"
import { RadioGroup } from "@headlessui/react"
import { CheckCircleIcon } from "@heroicons/react/20/solid"
import {
  IoIosInformationCircleOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io"

export default function AddFeedback() {
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
        <div className="flex flex-col gap-3">
          {metrics.map((metric) => (
            <RadioButton
              label={metric.label}
              key={metric.id}
              description={metric.description}
            />
          ))}
        </div>
      </div>
    </form>
  )
}

const mailingLists = [
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
  const [selectedMailingLists, setSelectedMailingLists] = useState(
    mailingLists[1]
  )

  return (
    <RadioGroup
      value={selectedMailingLists}
      onChange={setSelectedMailingLists}
      className="flex items-center justify-between"
    >
      <RadioGroup.Label className="flex items-center gap-1 text-sm font-semibold text-neutral-900">
        {label}{" "}
        <span title={description}>
          <IoMdInformationCircleOutline />
        </span>
      </RadioGroup.Label>

      <div className="grid grid-cols-1 sm:grid-cols-3">
        {mailingLists.map((mailingList) => (
          <RadioGroup.Option
            key={mailingList.id}
            value={mailingList}
            className={({ checked, active }) =>
              classNames(
                active ? "border-primary-600" : "border-neutral-100",
                checked ? "bg-primary-500" : "bg-transparent",
                "flex cursor-pointer border bg-white p-3 shadow first:rounded-l-full last:rounded-r-full"
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
