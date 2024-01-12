import Link from "next/link"
import Image from "next/image"
import { PublishedStatus } from "../ui/badges"
import { RiPencilRulerLine, RiSlideshowLine } from "react-icons/ri"
import { MdDescription } from "react-icons/md"
import { BsFillCheckCircleFill } from "react-icons/bs"

interface CurrentLessonProps {
  lessonList: []
  admin: boolean
  unitPublished: boolean
  studentId?: string
  edit?: boolean
  lessonCompletions?: any
}

export function CurrentLesson({
  lessonList,
  admin,
  unitPublished,
  studentId,
  edit,
  lessonCompletions,
}: CurrentLessonProps) {
  interface LessonPanelProps {
    lessonNumber: number
    lessonId: string
    lessonPhoto: string
    lessonTitle: string
    lessonSlides: string
    lessonObjective: string
    lessonAssignments: any
    published: boolean
  }

  function LessonPanel({
    lessonNumber,
    lessonId,
    lessonPhoto,
    lessonTitle,
    lessonSlides,
    lessonObjective,
    lessonAssignments,
    published,
  }: LessonPanelProps) {
    function getLinkHref() {
      if (edit) {
        return `/admin/curriculum/${lessonId}`
      } else {
        if (admin) {
          return `/admin/students/${studentId}/${lessonId}`
        }
      }
      return `/teacher/students/${studentId}/${lessonId}`
    }

    return (
      <div className="relative z-0 flex items-center space-x-3">
        <div>
          <span
            className={
              lessonCompletions && lessonCompletions.includes(lessonId)
                ? "inline-flex items-center justify-center w-12 h-12 p-2 text-2xl font-bold rounded-full bg-primary-800 text-primary-100 opacity-30"
                : "inline-flex items-center justify-center w-12 h-12 p-2 text-2xl font-bold rounded-full bg-primary-800 text-primary-100"
            }
          >
            {lessonNumber}
          </span>
        </div>
        <Link href={getLinkHref()} legacyBehavior>
          {/* <Link
          href={
            edit
              ? `/admin/curriculum/${lessonId}`
              : `/teacher/students/${studentId}/${lessonId}`
          }
        > */}

          <div
            className={
              lessonCompletions && lessonCompletions.includes(lessonId)
                ? "flex justify-between flex-1 min-w-0 space-x-4 opacity-30"
                : "flex justify-between flex-1 min-w-0 space-x-4"
            }
          >
            <div className="flex items-center min-w-full space-x-3 bg-white border-2 border-opacity-0 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:border-primary-500 hover:shadow-lg hover:cursor-pointer">
              <Image
                height={80}
                width={125}
                className="rounded-l"
                src={lessonPhoto}
                alt=""
              />
              <div className="flex items-center justify-between w-full pr-6">
                <div className="flex items-center flex-1 min-w-0 gap-2">
                  <p className="text-lg font-bold text-neutral-900">
                    {lessonTitle}
                  </p>
                  <div>
                    {admin && edit && (
                      <PublishedStatus
                        published={published}
                        parentPublished={unitPublished}
                        draftedBy="Unit"
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {lessonSlides ? (
                    <div className="flex flex-col items-center w-16 text-4xl opacity-80">
                      <RiSlideshowLine />
                      <div className="text-xs">Slides</div>
                    </div>
                  ) : null}
                  {lessonObjective ? (
                    <div className="flex flex-col items-center w-16 text-4xl opacity-80">
                      <MdDescription />
                      <div className="text-xs">Objective</div>
                    </div>
                  ) : null}
                  {lessonAssignments.length > 0 ? (
                    <div className="flex flex-col items-center w-16 text-4xl opacity-80">
                      <RiPencilRulerLine />
                      <div className="text-xs">Assignments</div>
                    </div>
                  ) : null}
                </div>
                {lessonCompletions && lessonCompletions.includes(lessonId) && (
                  <div className="absolute top-0 right-0 z-10 text-2xl transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full opacity-100 text-primary-800">
                    <BsFillCheckCircleFill />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  const lessonLine = (idParam: string) => {
    if (lessonCompletions) {
      return (
        <span
          className={
            lessonCompletions.includes(idParam)
              ? "absolute top-[67px] left-6 -ml-px h-[74px] w-0.5 bg-primary-800 opacity-10"
              : "absolute top-12 left-6 -ml-px h-24 w-0.5 bg-primary-800"
          }
          aria-hidden="true"
        />
      )
    } else return ""
  }

  const publishedLessons = lessonList.filter((lesson: any) => lesson.published)

  const adminEditBoolean = admin !== edit

  const styles = (index: number) =>
    index !== publishedLessons.length - 1 ? "relative pb-8" : "relative pb-8"

  return (
    <div className="flex flex-col gap-3">
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {!admin &&
            publishedLessons.map((lesson: any, lessonIdx: number) => (
              <li key={lesson.id}>
                <div className={styles(lessonIdx)}>
                  {lessonIdx !== publishedLessons.length - 1
                    ? lessonLine(lesson.id)
                    : null}
                  <LessonPanel
                    lessonNumber={lesson.number}
                    lessonId={lesson.id}
                    lessonPhoto={lesson.photoUrl}
                    lessonTitle={lesson.title}
                    lessonSlides={lesson.slidesUrl}
                    lessonObjective={lesson.objective}
                    lessonAssignments={lesson.assignments}
                    published={lesson.published}
                  />
                </div>
              </li>
            ))}
          {admin &&
            !edit &&
            publishedLessons.map((lesson: any, lessonIdx: number) => (
              <li key={lesson.id}>
                <div className={styles(lessonIdx)}>
                  {lessonIdx !== publishedLessons.length - 1
                    ? lessonLine(lesson.id)
                    : null}
                  <LessonPanel
                    lessonNumber={lesson.number}
                    lessonId={lesson.id}
                    lessonPhoto={lesson.photoUrl}
                    lessonTitle={lesson.title}
                    lessonSlides={lesson.slidesUrl}
                    lessonObjective={lesson.objective}
                    lessonAssignments={lesson.assignments}
                    published={lesson.published}
                  />
                </div>
              </li>
            ))}
          {admin &&
            edit &&
            lessonList.map((lesson: any, lessonIdx: number) => (
              <li key={lesson.id}>
                <div className={styles(lessonIdx)}>
                  {lessonIdx !== lessonList.length - 1 ? (
                    <span
                      className="absolute top-12 left-6 -ml-px h-24 w-0.5 bg-primary-800"
                      aria-hidden="true"
                    />
                  ) : null}
                  <LessonPanel
                    lessonNumber={lesson.number}
                    lessonId={lesson.id}
                    lessonPhoto={lesson.photoUrl}
                    lessonTitle={lesson.title}
                    lessonSlides={lesson.slidesUrl}
                    lessonObjective={lesson.objective}
                    lessonAssignments={lesson.assignments}
                    published={lesson.published}
                  />
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
