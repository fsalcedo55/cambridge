import {
  LessonInfo,
  SlideComponent,
} from "@src/components/lessonDetails/LessonDetails"
import Container from "@src/components/ui/Container"
import { ButtonLegacy } from "@src/components/ui/buttonLegacy"
import Loading from "@src/components/ui/loading"
import PageHeadingWithBreadcrumb from "@src/components/ui/pageHeadingWithBreadcrumb"
import { getAuthSession } from "@src/server/common/get-server-session"
import { trpc } from "@src/utils/trpc"
import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { MdDescription } from "react-icons/md"
import { BsFillCheckCircleFill } from "react-icons/bs"
import { Fragment, useEffect, useState } from "react"
import { BiCommentCheck } from "react-icons/bi"
import Modal from "@src/components/ui/modal"
import AddFeedback from "@src/components/teacher/feedback/AddFeedback"
import Image from "next/image"
import dayjs from "dayjs"
import { Menu, Transition } from "@headlessui/react"
import { TfiMoreAlt } from "react-icons/tfi"
import { RiDeleteBinLine } from "react-icons/ri"
import { toast } from "sonner"

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

type ModalType = "ADD_FEEDBACK" | "DELETE_COMMENT" | null

export default function TeacherStudentLessonPage({ sessionSSR }: any) {
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
  const me = trpc.user.me.useQuery({ email: sessionSSR.user.email })
  const createLessonCompletion = trpc.lessonCompletion.create.useMutation()
  const deleteLessonCompletion = trpc.lessonCompletion.delete.useMutation()
  const lessonComments =
    trpc.lessonComment.getCommentsByLessonAndStudent.useQuery(
      {
        studentId: id as string,
        lessonId: lessonId as string,
      },
      {
        enabled: !!id && !!lessonId,
      }
    )
  const deleteComment = trpc.lessonComment.deleteComment.useMutation()

  const [isCompleted, setIsCompleted] = useState(false)
  const [commentId, setCommentId] = useState<string>()

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
        toast.promise(
          deleteLessonCompletion.mutateAsync({
            id: lessonCompletion.data?.[0]?.id ?? "",
          }),
          {
            loading: "Loading...",
            success: (data) => {
              return `${lesson.data?.title} is not completed.`
            },
            error: "Error",
          }
        )
      } else {
        toast.promise(
          createLessonCompletion.mutateAsync({
            studentId: id as string,
            lessonId: lessonId as string,
          }),
          {
            loading: "Loading...",
            success: (data) => {
              return `${lesson.data?.title} has been completed.`
            },
            error: "Error",
          }
        )
      }
      setIsCompleted(!isCompleted)
    } catch (error) {
      toast.error("Error updating completion status")
    }
  }

  const handleDeleteCommentModal = async () => {
    try {
      await deleteComment.mutateAsync({ commentId: commentId ?? "" })
      toast.success("Comment Deleted")
    } catch (error) {
      toast.error("Error deleting comment.")
    }
    setCurrentModal(null)
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
          {lesson.data &&
            lesson.data.objective &&
            lesson.data.objective.length > 0 && (
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
            )}
          <div className="h-4"></div>
          {assignments.data && assignments.data.length > 0 && (
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
                              <div className="font-bold">
                                {assignment.title}
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </fieldset>
            </Container>
          )}
        </div>
      </div>
      <div className="h-4"></div>
      {lessonComments.data && (
        <Container title="Comments">
          <div className="flex flex-col">
            {lessonComments.data.length <= 0 && "No comments yet."}
            {lessonComments.data.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <div>
                  <div className="h-2"></div>
                  <div className="flex justify-start w-full gap-2 mb-2 md:gap-4">
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full md:w-10 md:h-10">
                        <Image
                          src={comment.User.image ?? ""}
                          alt="teacher-photo"
                          height={40}
                          width={40}
                        />
                      </div>
                    </div>
                    <Menu as="div" className="relative flex gap-1 group">
                      <div className="flex flex-col gap-1 px-4 py-3 text-sm rounded-lg shadow group bg-neutral-50 text-primary-900">
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{comment.User.name}</p>
                          <div className="hidden text-xs font-thin opacity-50 md:block">
                            {`${dayjs(comment.createdAt).format(
                              "MMM D, YYYY"
                            )} at ${dayjs(comment.createdAt).format("h:mm A")}`}
                          </div>
                          <div className="text-xs font-thin opacity-50 md:hidden">
                            {`${dayjs(comment.createdAt).format("MMM D, 'YY")}`}
                          </div>
                        </div>
                        <p className="text-base">{comment.content}</p>
                      </div>
                      <div>
                        {comment.User.id == me.data?.id && (
                          <Menu.Button className="invisible h-5 px-2 py-1 rounded-lg shadow cursor-pointer hover:bg-neutral-100 bg-neutral-50 group-hover:visible">
                            <TfiMoreAlt />
                          </Menu.Button>
                        )}
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-6 origin-top-right rounded-md shadow-lg w-36 bg-base-100 ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-2">
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  onClick={(id) => {
                                    setCommentId(comment.id)
                                    return setCurrentModal("DELETE_COMMENT")
                                  }}
                                  className="flex items-center gap-0.5 hover:bg-base-200 text-base-content rounded cursor-pointer p-3"
                                >
                                  <div className="text-xl">
                                    <RiDeleteBinLine />
                                  </div>
                                  <div className="text-sm">Delete</div>
                                </div>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              {!lessonCompletion.isLoading && (
                <ButtonLegacy
                  intent="secondary"
                  size="small"
                  className="max-w-sm px-4"
                  onClick={() => setCurrentModal("ADD_FEEDBACK")}
                >
                  <span className="flex items-center gap-2 text-base">
                    <BiCommentCheck className="text-lg" />
                    Add Feedback
                  </span>
                </ButtonLegacy>
              )}
            </div>
          </div>
        </Container>
      )}
      <div className="flex flex-col items-center justify-center my-6">
        {lessonCompletion.isLoading && <Loading />}

        {!lessonCompletion.isLoading && isLessonCompleted ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <BsFillCheckCircleFill className="text-7xl" />
            <div className="text-3xl font-bold">Lesson Completed</div>
            <ButtonLegacy
              intent="secondary"
              size="small"
              onClick={toggleCompletion}
            >
              Mark as not completed
            </ButtonLegacy>
          </div>
        ) : (
          <ButtonLegacy
            intent="primary"
            size="large"
            className="px-24"
            onClick={toggleCompletion}
          >
            <span className="text-xl">Mark as Completed</span>
          </ButtonLegacy>
        )}
      </div>

      {/* Add Comment Modal */}
      <Modal
        isOpen={currentModal === "ADD_FEEDBACK"}
        setIsOpen={setCurrentModal}
        title={"Add Feedback"}
        description={
          <AddFeedback
            studentId={id as string}
            lessonId={lessonId as string}
            closeModal={() => setCurrentModal(null)}
          />
        }
        closeButton={"Cancel"}
      />
      {/* Delete Comment Modal */}
      <Modal
        isOpen={currentModal === "DELETE_COMMENT"}
        setIsOpen={setCurrentModal}
        loading={deleteComment.isLoading}
        loadingLabel="Deleting Comment..."
        btnIntent="danger"
        currentData={commentId}
        actionFunction={handleDeleteCommentModal}
        closeButton="Cancel"
        actionButton="Delete"
        title="Delete Comment"
        description={
          <div>
            <p className="mt-2">
              Are you sure you want to delete this comment?
            </p>
          </div>
        }
      />
    </>
  )
}

TeacherStudentLessonPage.auth = true
