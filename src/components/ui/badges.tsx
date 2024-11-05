import { BsCheckLg } from "react-icons/bs"
import { MdUnpublished } from "react-icons/md"

interface PublishedStatusProps {
  parentPublished?: boolean
  published: boolean
  draftedBy?: string
}

export function PublishedStatus({
  parentPublished,
  published,
  draftedBy,
}: PublishedStatusProps) {
  const draftedStyles =
    "inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800 border border-neutral-900 gap-1"
  if (parentPublished === false) {
    return (
      <span className={draftedStyles}>
        <MdUnpublished />
        Drafted by the {draftedBy}
      </span>
    )
  }
  return (
    <div>
      {published ? (
        <span className="inline-flex items-center rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-800 border border-accent-900 gap-2">
          <BsCheckLg />
          Published
        </span>
      ) : (
        <span className={draftedStyles}>
          <MdUnpublished />
          Draft
        </span>
      )}
    </div>
  )
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

interface BadgeProps {
  label: string | number | undefined
  backgroundColor: string
  textColor: string
}

export function Badge({
  label,
  backgroundColor = "bg-gray-50",
  textColor = "text-gray-600",
}: BadgeProps) {
  const ringColor = textColor.replace("text", "ring")
  return (
    <>
      <span
        className={classNames(
          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
          textColor,
          backgroundColor,
          ringColor
        )}
      >
        {label}
      </span>
    </>
  )
}
