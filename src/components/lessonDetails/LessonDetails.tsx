import Image from "next/image"
import { PublishedStatus } from "../ui/badges"
import Loading from "../ui/loading"
import { RiSlideshowLine } from "react-icons/ri"
import Link from "next/link"
import { ButtonLegacy } from "../ui/buttonLegacy"
import { HiOutlineExternalLink } from "react-icons/hi"

interface LessonData {
  number: number
  title: string
  Unit: {
    number: number
    title: string
    Level: {
      number: number
      title: string
      id: string
    }
    id: string
    published: boolean
  }
  id: string
  published: boolean
  slidesUrl: string | null
  photoUrl: string
  objective: string | null
}

interface LessonInfoProps {
  lesson: {
    data?: LessonData | null
    isLoading?: boolean
  }
  edit?: boolean
}

export function LessonInfo({ lesson, edit }: LessonInfoProps) {
  return (
    <div className="flex justify-between flex-1 min-w-0 space-x-4">
      <div className="flex items-center gap-4">
        {lesson.data?.photoUrl && (
          <Image
            height={138.24}
            width={200}
            className="rounded"
            src={lesson.data.photoUrl}
            alt=""
          />
        )}
        <div className="flex items-center w-full gap-2">
          <p className="text-2xl font-bold text-neutral-900">
            {lesson.data?.title}
          </p>
          <div>
            {lesson.data &&
              lesson.data.published &&
              lesson.data.Unit?.published &&
              edit && (
                <PublishedStatus
                  published={lesson.data.published}
                  parentPublished={lesson.data.Unit.published}
                  draftedBy="Unit"
                />
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SlideContent({
  isLoading,
  data,
}: {
  isLoading: boolean | undefined
  data: LessonData | null | undefined
}) {
  if (isLoading) return <Loading />
  if (data?.slidesUrl) {
    return (
      <iframe
        src={`${data.slidesUrl}/embed?start=false&loop=false&delayms=60000`}
        width="480"
        height="299"
        allowFullScreen={true}
        className="flex-1"
      ></iframe>
    )
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="opacity-50 text-8xl">
        <RiSlideshowLine />
      </div>
      <div className="font-bold">Add slides URL to see the content</div>
    </div>
  )
}

interface SlideComponentProps {
  lesson: {
    data?: LessonData | null
    isLoading?: boolean
  }
  admin?: boolean
}

export function SlideComponent({ lesson, admin }: SlideComponentProps) {
  return (
    <div>
      <div className="flex justify-between p-2 bg-white rounded-t-xl">
        <div className="text-xl font-bold">Slides</div>
        {admin && lesson.data?.slidesUrl && (
          <Link
            href={lesson.data.slidesUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ButtonLegacy
              size="small"
              intent="secondary"
              className="flex items-center gap-2"
            >
              <span>Edit on Google Slides</span>
              <HiOutlineExternalLink />
            </ButtonLegacy>
          </Link>
        )}
      </div>
      <div className="w-[480px] h-[299px] bg-neutral-200 rounded-b-xl flex items-center justify-center">
        <SlideContent isLoading={lesson.isLoading} data={lesson.data} />
      </div>
    </div>
  )
}
