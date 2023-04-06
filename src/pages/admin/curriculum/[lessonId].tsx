import EditLesson from "@src/components/admin/lessons/EditLesson"
import Layout from "@src/components/layout/layout"
import { Button } from "@src/components/ui/button"
import Loading from "@src/components/ui/loading"
import Modal from "@src/components/ui/modal"
import PageHeadingWithBreadcrumb from "@src/components/ui/pageHeadingWithBreadcrumb"
import { trpc } from "@src/utils/trpc"
import { useRouter } from "next/router"
import { useState, useEffect, useRef } from "react"
import { BiLinkAlt } from "react-icons/bi"
import { RiDeleteBinLine, RiPencilLine, RiSlideshowLine } from "react-icons/ri"
import Image from "next/image"
import { MdDescription } from "react-icons/md"
import { HiOutlineExternalLink } from "react-icons/hi"
import { HiArrowTopRightOnSquare } from "react-icons/hi2"
import Link from "next/link"
import AddAssignment from "@src/components/admin/lessons/AddAssignment"
import EditAssignment from "@src/components/admin/lessons/EditAssignment"

interface Props {
  lessonTitle: string
  levels: any
}

export default function LessonPage({ lessonTitle, levels }: Props) {
  const router = useRouter()
  const { lessonId } = router.query
  const [isOpenDeleteLessonModal, setIsOpenDeleteLessonModal] = useState(false)
  const [isOpenEditLessonModal, setIsOpenEditLessonModal] = useState(false)
  const [isOpenAddAssignmentModal, setIsOpenAddAssignmentModal] =
    useState(false)
  const [isOpenEditAssignmentModal, setIsOpenEditAssignmentModal] =
    useState(false)
  const [isOpenDeleteAssignmentModal, setIsOpenDeleteAssignmentModal] =
    useState(false)
  const currentAssignment = useRef<{
    title: string
    url: string
    lessonId: string
    id: string
  }>({
    title: "",
    url: "",
    lessonId: "",
    id: "",
  })
  // const [currentAssignment, setCurrentAssignment] = useState<{
  //   title: string
  //   url: string
  //   lessonId: string
  //   id: string
  // }>({
  //   title: "",
  //   url: "",
  //   lessonId: "",
  //   id: "",
  // })
  const lesson = trpc.lesson.getById.useQuery(
    { id: lessonId as string },
    { enabled: router.isReady }
  )
  const deleteLesson = trpc.lesson.delete.useMutation()
  const editLesson = trpc.lesson.edit.useMutation()
  const assignments = trpc.assignment.getById.useQuery(
    { lessonId: lessonId as string },
    { enabled: router.isReady }
  )
  const deleteAssignment = trpc.assignment.delete.useMutation()

  const deleteAssignmentEvent = async () => {
    try {
      await deleteAssignment.mutateAsync({
        id: currentAssignment.current.id,
      })
    } catch (error) {
      console.log("Error deleting assignment.", error)
    }
    setIsOpenDeleteAssignmentModal(false)
  }

  const deleteLessonEvent = async () => {
    try {
      await deleteLesson.mutateAsync({
        id: lessonId as string,
      })
    } catch (error) {
      console.log("Error deleting lesson.", error)
    }
    router.push("/admin/curriculum")
  }

  const pages = [
    { name: "Curriculum", href: "/admin/curriculum/", current: false },
    {
      name: `Level ${lesson.data?.Unit?.Level?.number}: ${lesson.data?.Unit?.Level?.title} / Unit ${lesson.data?.Unit?.number}: ${lesson.data?.Unit?.title} / Lesson ${lesson.data?.number}: ${lesson.data?.title}`,
      href: `/admin/curriculum/${lesson.data?.id}`,
      current: true,
    },
  ]

  const handleEditAssignment = (assignment: any) => {
    // setCurrentAssignment(assignment)
    currentAssignment.current = assignment
    setIsOpenEditAssignmentModal(true)
  }

  const handleDeleteAssignmentModal = (assignment: any) => {
    currentAssignment.current = assignment
    setIsOpenDeleteAssignmentModal(true)
  }

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <PageHeadingWithBreadcrumb
            pages={pages}
            pageTitle={
              <div className="flex justify-between flex-1 min-w-0 space-x-4">
                <div className="flex items-center space-x-3">
                  <Image
                    height={138.24}
                    width={200}
                    className="rounded"
                    src={lesson.data?.photoUrl!}
                    alt=""
                  />
                  <div className="flex items-center justify-between w-full pr-6">
                    <p className="text-2xl font-bold text-neutral-900">
                      {lesson.data?.title}
                    </p>
                  </div>
                </div>
              </div>
            }
            loading={lesson.isLoading}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsOpenEditLessonModal(true)}
            size="small"
            intent="secondary"
            className="flex gap-2"
          >
            <RiPencilLine />
            Edit Lesson
          </Button>
          <Button
            size="small"
            intent="danger"
            className="flex gap-2"
            onClick={() => setIsOpenDeleteLessonModal(true)}
          >
            <RiDeleteBinLine /> Delete Lesson
          </Button>
        </div>
      </div>
      <div className="flex gap-4">
        <div>
          <div>
            <div className="flex justify-between p-2 bg-white rounded-t-xl">
              <div className="text-xl font-bold">Slides</div>
              {lesson.data?.slidesUrl && (
                <Link href={lesson.data?.slidesUrl!}>
                  <a target="_blank" rel="noopener noreferrer">
                    <Button
                      size="small"
                      intent="secondary"
                      className="flex items-center gap-2"
                    >
                      <span>Edit on Google Slides</span>
                      <HiOutlineExternalLink />
                    </Button>
                  </a>
                </Link>
              )}
            </div>
            <div className="w-[480px] h-[299px] bg-neutral-200 rounded-b-xl flex items-center justify-center">
              {lesson.isLoading ? (
                <div>
                  <Loading />
                </div>
              ) : lesson.data?.slidesUrl ? (
                <iframe
                  src={`${lesson.data?.slidesUrl}/embed?start=false&loop=false&delayms=60000`}
                  width="480"
                  height="299"
                  allowFullScreen={true}
                  className="flex-1"
                ></iframe>
              ) : (
                <div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="opacity-50 text-8xl">
                      <RiSlideshowLine />
                    </div>
                    <div className="font-bold">
                      Add slides URL to see the content
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-4"></div>
          <div className="px-4 pb-2 bg-white shadow rounded-xl">
            <div className="py-2 text-xl font-bold">Feedback</div>
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-b border-gray-300" />
              </div>
              <div className="relative flex justify-center"></div>
            </div>
            <div className="py-3">Feedback goes here</div>
          </div>
        </div>
        <div className="flex-1">
          <div className="px-4 pb-2 bg-white shadow rounded-xl">
            <div className="flex items-center justify-between py-2">
              <div className="text-xl font-bold">Lesson Objective</div>
              {/* <Button size="small" intent="secondary">
                Edit
              </Button> */}
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-b border-gray-300" />
              </div>
              <div className="relative flex justify-center"></div>
            </div>
            <div className="py-3">
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
            </div>
          </div>

          <div className="h-4"></div>
          <div className="px-4 pb-2 bg-white shadow rounded-xl">
            <div className="flex items-center justify-between py-2">
              <div className="text-xl font-bold">Assignments</div>
              {/* <Button size="small" intent="secondary">
                Edit
              </Button> */}
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-b border-gray-300" />
              </div>
              <div className="relative flex justify-center"></div>
            </div>
            <div className="py-3">
              {" "}
              <fieldset>
                <legend className="sr-only">Notifications</legend>
                <div>
                  <div className="relative flex items-start">
                    <div
                      onClick={() => setIsOpenAddAssignmentModal(true)}
                      className="flex items-center min-w-0 gap-1"
                    >
                      {/* <div className="opacity-50">
                        <BiLinkAlt />
                      </div> */}
                      <div className="p-2 rounded-lg cursor-pointer hover:bg-neutral-50">
                        <span className="text-xl font-bold">+</span> Add
                        assignment
                      </div>
                    </div>
                  </div>
                  <div className="relative items-start">
                    {assignments.data?.map((assignment, idx) => (
                      <div
                        className="flex flex-col border border-white border-opacity-0 rounded-lg hover:shadow-lg hover:border hover:border-neutral-200 group/assignment"
                        key={assignment.id}
                      >
                        <div className="flex items-center justify-between my-1">
                          <Link href={assignment.url}>
                            <a target="_blank" rel="noopener noreferrer">
                              <div className="flex items-center min-w-0 gap-1 pl-2 cursor-pointer hover:underline">
                                <div>{assignment.title}</div>
                                <div className="opacity-50">
                                  <HiArrowTopRightOnSquare />
                                </div>
                              </div>
                            </a>
                          </Link>

                          <div className="flex invisible gap-1 px-2 opacity-80 group-hover/assignment:visible">
                            <div
                              className="z-50 flex items-center gap-1 p-2 rounded cursor-pointer hover:bg-neutral-100"
                              onClick={() => handleEditAssignment(assignment)}
                            >
                              <RiPencilLine />
                              <span className="text-xs">Edit Assignment</span>
                            </div>
                            <div
                              className="flex items-center gap-1 p-2 rounded cursor-pointer hover:bg-neutral-100"
                              onClick={() =>
                                handleDeleteAssignmentModal(assignment)
                              }
                            >
                              <RiDeleteBinLine />{" "}
                              <span className="text-xs">Delete Assignment</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* <div className="text-xs opacity-50">
                        Updated 3/28/2023
                      </div> */}
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          {/* <div className="h-4"></div>
          <div className="px-4 pb-2 bg-white shadow rounded-xl">
            <div className="flex items-center justify-between py-2">
              <div className="text-xl font-bold">Extra Resources</div>
              <Button size="small" intent="secondary">
                Edit
              </Button>
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-b border-gray-300" />
              </div>
              <div className="relative flex justify-center"></div>
            </div>
            <div className="py-3">Links to resources go here</div>
          </div> */}
        </div>
      </div>
      {/* Delete Lesson Modal */}
      <Modal
        isOpen={isOpenDeleteLessonModal}
        setIsOpen={setIsOpenDeleteLessonModal}
        actionFunction={deleteLessonEvent}
        loading={deleteLesson.isLoading}
        btnIntent="danger"
        actionButton="Delete"
        loadingLabel="Deleting Lesson..."
        title="Delete Lesson"
        description={
          <div>
            <p className="mt-2">Are you sure you want to delete this lesson?</p>
          </div>
        }
        closeButton="Cancel"
      />
      {/* Edit Lesson Modal */}
      <Modal
        isOpen={isOpenEditLessonModal}
        setIsOpen={setIsOpenEditLessonModal}
        loading={editLesson.isLoading}
        loadingLabel="Updating Lesson..."
        title="Edit Lesson"
        description={
          <EditLesson
            currentLesson={lesson}
            closeModal={() => setIsOpenEditLessonModal(false)}
          />
        }
        closeButton="Cancel"
      />
      {/* Add Assignment Modal */}
      <Modal
        isOpen={isOpenAddAssignmentModal}
        setIsOpen={setIsOpenAddAssignmentModal}
        title="Add Assignment"
        description={
          <AddAssignment
            currentLesson={lesson}
            closeModal={() => setIsOpenAddAssignmentModal(false)}
          />
        }
        closeButton="Cancel"
      />
      {/* Edit Assignment Modal */}
      <Modal
        isOpen={isOpenEditAssignmentModal}
        setIsOpen={setIsOpenEditAssignmentModal}
        loading={editLesson.isLoading}
        title={`Edit ${currentAssignment.current.title}`}
        description={
          <EditAssignment
            currentAssignment={currentAssignment.current}
            closeModal={() => setIsOpenEditAssignmentModal(false)}
          />
        }
        closeButton="Cancel"
      />
      {/* Delete Assignment Modal */}
      <Modal
        isOpen={isOpenDeleteAssignmentModal}
        setIsOpen={setIsOpenDeleteAssignmentModal}
        actionFunction={deleteAssignmentEvent}
        loading={deleteAssignment.isLoading}
        btnIntent="danger"
        actionButton="Delete"
        loadingLabel="Deleting Assignment..."
        title={`Delete ${currentAssignment.current.title}`}
        description={
          <div>
            <p className="mt-2">
              Are you sure you want to delete this assignment?
            </p>
          </div>
        }
        closeButton="Cancel"
      />
    </Layout>
  )
}
