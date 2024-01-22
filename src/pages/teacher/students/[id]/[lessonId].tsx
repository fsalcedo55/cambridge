import {
  LessonInfo,
  SlideComponent,
} from "@src/components/lessonDetails/LessonDetails"
import Container from "@src/components/ui/Container"
import { Button } from "@src/components/ui/button"
import Loading from "@src/components/ui/loading"
import PageHeadingWithBreadcrumb from "@src/components/ui/pageHeadingWithBreadcrumb"
import { getAuthSession } from "@src/server/common/get-server-session"
import { trpc } from "@src/utils/trpc"
import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { MdDescription } from "react-icons/md"
import { BsFillCheckCircleFill } from "react-icons/bs"
import { useEffect, useState } from "react"
import { BiCommentCheck } from "react-icons/bi"
import Modal from "@src/components/ui/modal"
import AddFeedback from "@src/components/teacher/feedback/AddFeedback"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSession(ctx)
  if (!session || session.role != "teacher") {
    return { redirect: { destination: "/", permanent: false } }
  }
  return {
    props: {
      sessionSSR: await getAuthSession(ctx),
    },
  }
}

type ModalType = "ADD_FEEDBACK" | null

export default function TeacherStudentLessonPage() {
  const [currentModal, setCurrentModal] = useState<ModalType>(null)
  const router = useRouter()
  const { lessonId } = router.query
  const { id } = router.query
  const student = trpc.student.byId.useQuery(
    {
      id: id as string,
    },
    { enabled: router.isReady }
  )
  const lesson = trpc.lesson.getById.useQuery(
    { id: lessonId as string },
    { enabled: router.isReady }
  )
  const assignments = trpc.assignment.getById.useQuery(
    { lessonId: lessonId as string },
    { enabled: router.isReady }
  )
  const lessonCompletion = trpc.lessonCompletion.getByStudentAndLesson.useQuery(
    {
      studentId: id as string,
      lessonId: lessonId as string,
    },
    {
      enabled: !!id && !!lessonId,
    }
  )

  const createLessonCompletion = trpc.lessonCompletion.create.useMutation()
  const deleteLessonCompletion = trpc.lessonCompletion.delete.useMutation()

  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const isCompleted = !!lessonCompletion?.data?.length
    setIsCompleted(isCompleted)
  }, [lessonCompletion.data])

  const isLessonCompleted =
    lessonCompletion.data && lessonCompletion.data.length > 0

  const pages = [
    { name: "Students", href: "/admin/students/", current: false },
    {
      name: `${student.data?.studentFirstName} ${student.data?.studentLastName}`,
      href: `/teacher/students/${student.data?.id}`,
      current: false,
    },
    {
      name: `Level ${lesson.data?.Unit?.Level?.number}: ${lesson.data?.Unit?.Level?.title} / Unit ${lesson.data?.Unit?.number}: ${lesson.data?.Unit?.title} / Lesson ${lesson.data?.number}: ${lesson.data?.title}`,
      current: true,
    },
  ]

  const toggleCompletion = async () => {
    try {
      if (isCompleted) {
        await deleteLessonCompletion.mutateAsync({
          id: lessonCompletion.data?.[0]?.id ?? "",
        })
      } else {
        await createLessonCompletion.mutateAsync({
          studentId: id as string,
          lessonId: lessonId as string,
        })
      }
      setIsCompleted(!isCompleted)
    } catch (error) {
      console.error("Error updating completion status", error)
      // Consider adding user feedback here (like a toast notification)
    }
  }

  return (
    <>
      <PageHeadingWithBreadcrumb
        pages={pages}
        pageTitle={<LessonInfo lesson={lesson} />}
        loading={lesson.isLoading}
      />
      <div className="flex gap-4">
        <div>
          <SlideComponent lesson={lesson} admin={false} />
        </div>
        <div className="flex-1">
          <Container title="Lesson Objective">
            {lesson?.data?.objective?.length! > 0 ? (
              lesson.data?.objective
            ) : (
              <div className="flex items-center justify-center">
                <div>
                  <div className="flex justify-center mb-2 text-5xl opacity-50">
                    <MdDescription />
                  </div>
                  <div>Add an Objective</div>
                </div>
              </div>
            )}
          </Container>
          <div className="h-4"></div>
          <Container title="Assignments">
            <fieldset>
              <div>
                <div className="relative flex items-start"></div>
                <div className="relative items-start">
                  {assignments.data?.map((assignment: any) => (
                    <div
                      className="flex flex-col border border-white border-opacity-0 rounded-lg hover:shadow-lg hover:border hover:border-neutral-200 group/assignment"
                      key={assignment.id}
                    >
                      <div className="flex items-center justify-between my-1">
                        <Link
                          href={assignment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="flex items-center min-w-0 gap-1 pl-2 cursor-pointer hover:underline">
                            <div className="font-bold">{assignment.title}</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </fieldset>
          </Container>
        </div>
      </div>
      <div className="h-4"></div>
      <div className="flex flex-col items-center justify-center my-6">
        {isLessonCompleted && !lessonCompletion.isLoading && (
          <Button
            intent="primary"
            size="large"
            className="px-24 mb-6"
            onClick={() => setCurrentModal("ADD_FEEDBACK")}
          >
            <span className="flex items-center gap-2 text-xl">
              <BiCommentCheck className="text-2xl" />
              Add Feedback
            </span>
          </Button>
        )}
        {lessonCompletion.isLoading ? (
          <Loading />
        ) : isLessonCompleted ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <BsFillCheckCircleFill className="text-7xl" />
            <div className="text-3xl font-bold">Lesson Completed</div>
            <Button intent="secondary" size="small" onClick={toggleCompletion}>
              Mark as not completed
            </Button>
          </div>
        ) : (
          <Button
            intent="primary"
            size="large"
            className="px-24"
            onClick={toggleCompletion}
          >
            <span className="text-xl">Mark as Completed</span>
          </Button>
        )}
      </div>
      {/* Add Feedback Modal */}
      <Modal
        isOpen={currentModal === "ADD_FEEDBACK"}
        setIsOpen={setCurrentModal}
        title={"Add Feedback"}
        description={<AddFeedback />}
        closeButton={"Cancel"}
      />
    </>
  )
}

TeacherStudentLessonPage.auth = true
