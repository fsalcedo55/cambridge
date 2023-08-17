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
  if (parentPublished == false) {
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
