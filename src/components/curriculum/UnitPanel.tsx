import Image from "next/image"
import { PublishedStatus } from "../ui/badges"
import { SiBookstack } from "react-icons/si"

interface UnitPanelProps {
  imageUrl: string
  title: string
  levelPublished: boolean
  unitPublished: boolean
  unitNumber: number
  numberOfLessons: number
  admin: boolean
  edit?: boolean
}

export function UnitPanel({
  imageUrl,
  title,
  levelPublished,
  unitPublished,
  unitNumber,
  numberOfLessons,
  admin,
  edit,
}: UnitPanelProps) {
  return (
    <div className="relative flex items-center px-6 py-2 space-x-3">
      <Image
        height={120}
        width={175}
        src={imageUrl}
        alt=""
        className="rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <div className="flex gap-2">
          <p className="text-2xl font-bold md:text-2xl text-primary-800">
            {title}
          </p>
          {admin && edit && (
            <div>
              <PublishedStatus
                parentPublished={levelPublished}
                published={unitPublished}
                draftedBy={"Level"}
              />
            </div>
          )}
        </div>
        <p className="font-bold truncate text-neutral-500">Unit {unitNumber}</p>
        <div className="flex items-center gap-1 text-sm truncate text-neutral-500">
          <SiBookstack />
          <span>{numberOfLessons} Lessons</span>
        </div>
      </div>
    </div>
  )
}
