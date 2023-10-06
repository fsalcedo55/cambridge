// External Libraries
import { useState, useRef } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

// Components
import Layout from "@src/components/layout/layout"
import EditLesson from "@src/components/admin/lessons/EditLesson"
import AddAssignment from "@src/components/admin/lessons/AddAssignment"
import EditAssignment from "@src/components/admin/lessons/EditAssignment"

// UI Components
import Modal from "@ui/modal"
import PageHeadingWithBreadcrumb from "@ui/pageHeadingWithBreadcrumb"
import Container from "@ui/Container"
import { Button } from "@ui/button"

// TRPC Hooks
import { trpc } from "@src/utils/trpc"

// Icons
import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri"
import { MdDescription } from "react-icons/md"
import {
  LessonInfo,
  SlideComponent,
} from "@src/components/lessonDetails/LessonDetails"

interface Assignment {
  title: string
  url: string
  lessonId: string
  id: string
}

type ModalType =
  | "DELETE_LESSON"
  | "EDIT_LESSON"
  | "ADD_ASSIGNMENT"
  | "EDIT_ASSIGNMENT"
  | "DELETE_ASSIGNMENT"
  | null

export default function LessonPage() {
  const router = useRouter()
  const { lessonId } = router.query

  const [currentModal, setCurrentModal] = useState<ModalType>(null)
  const currentAssignment = useRef<Assignment>({
    title: "",
    url: "",
    lessonId: "",
    id: "",
  })
  const lesson = trpc.lesson.getById.useQuery(
    { id: lessonId as string },
    { enabled: router.isReady }
  )
  const assignments = trpc.assignment.getById.useQuery(
    { lessonId: lessonId as string },
    { enabled: router.isReady }
  )
  const deleteLesson = trpc.lesson.delete.useMutation()
  const editLesson = trpc.lesson.edit.useMutation()
  const deleteAssignment = trpc.assignment.delete.useMutation()

  const deleteAssignmentEvent = async () => {
    try {
      await deleteAssignment.mutateAsync({
        id: currentAssignment.current.id,
      })
    } catch (error) {
      console.log("Error deleting assignment.", error)
    }
    setCurrentModal(null)
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
    currentAssignment.current = assignment
    setCurrentModal("EDIT_ASSIGNMENT")
  }

  const handleDeleteAssignmentModal = (assignment: any) => {
    currentAssignment.current = assignment
    setCurrentModal("DELETE_ASSIGNMENT")
  }

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <PageHeadingWithBreadcrumb
          pages={pages}
          pageTitle={<LessonInfo lesson={lesson} />}
          loading={lesson.isLoading}
        />
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentModal("EDIT_LESSON")}
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
            onClick={() => setCurrentModal("DELETE_LESSON")}
          >
            <RiDeleteBinLine /> Delete Lesson
          </Button>
        </div>
      </div>
      <div className="flex gap-4">
        <div>
          <SlideComponent lesson={lesson} admin={true} />
          <div className="h-4"></div>
          <Container title="Feedback">Feedback goes here</Container>
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
                <div className="relative flex items-start">
                  <div
                    onClick={() => setCurrentModal("ADD_ASSIGNMENT")}
                    className="flex items-center min-w-0 gap-1"
                  >
                    <div className="p-2 text-sm rounded-lg cursor-pointer hover:bg-neutral-50">
                      <span className="text-xl font-bold">+</span> Add
                      assignment
                    </div>
                  </div>
                </div>
                <div className="relative items-start">
                  {assignments.data?.map((assignment: any) => (
                    <div
                      className="flex flex-col border border-white border-opacity-0 rounded-lg hover:shadow-lg hover:border hover:border-neutral-200 group/assignment"
                      key={assignment.id}
                    >
                      <div className="flex items-center justify-between my-1">
                        <Link href={assignment.url}>
                          <a target="_blank" rel="noopener noreferrer">
                            <div className="flex items-center min-w-0 gap-1 pl-2 cursor-pointer hover:underline">
                              <div className="font-bold">
                                {assignment.title}
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
                            <span className="text-xs">Edit</span>
                          </div>
                          <div
                            className="flex items-center gap-1 p-2 rounded cursor-pointer hover:bg-neutral-100"
                            onClick={() =>
                              handleDeleteAssignmentModal(assignment)
                            }
                          >
                            <RiDeleteBinLine />{" "}
                            <span className="text-xs">Delete</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </fieldset>
          </Container>
        </div>
      </div>
      {/* Delete Lesson Modal */}
      <Modal
        isOpen={currentModal === "DELETE_LESSON"}
        setIsOpen={setCurrentModal}
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
        isOpen={currentModal === "EDIT_LESSON"}
        setIsOpen={setCurrentModal}
        loading={editLesson.isLoading}
        loadingLabel="Updating Lesson..."
        title="Edit Lesson"
        description={
          <EditLesson
            currentLesson={lesson}
            closeModal={() => setCurrentModal(null)}
          />
        }
        closeButton="Cancel"
      />
      {/* Add Assignment Modal */}
      <Modal
        isOpen={currentModal === "ADD_ASSIGNMENT"}
        setIsOpen={setCurrentModal}
        title="Add Assignment"
        description={
          <AddAssignment
            currentLesson={lesson}
            closeModal={() => setCurrentModal(null)}
          />
        }
        closeButton="Cancel"
      />
      {/* Edit Assignment Modal */}
      <Modal
        isOpen={currentModal === "EDIT_ASSIGNMENT"}
        setIsOpen={setCurrentModal}
        loading={editLesson.isLoading}
        title={`Edit ${currentAssignment.current.title}`}
        description={
          <EditAssignment
            currentAssignment={currentAssignment.current}
            closeModal={() => setCurrentModal(null)}
          />
        }
        closeButton="Cancel"
      />
      {/* Delete Assignment Modal */}
      <Modal
        isOpen={currentModal === "DELETE_ASSIGNMENT"}
        setIsOpen={setCurrentModal}
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
