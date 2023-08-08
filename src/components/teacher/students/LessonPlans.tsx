import { useRouter } from "next/router"
import { trpc } from "@src/utils/trpc"
import LessonPlan from "@src/components/lessonPlan"
import AddLessonPlanCommentInput from "@src/components/addLessonPlanCommentInput"
import { useRef, useState } from "react"
import { Button } from "@ui/button"
import Modal from "@ui/modal"
import AddLessonPlan from "@src/components/addLessonPlan"
import Loading from "@ui/loading"
import { HiOutlineFolderAdd } from "react-icons/hi"
import EditLessonPlan from "@src/components/editLessonPlan"
import { useSession } from "next-auth/react"

interface Props {
  me: any
}

export default function LessonPlans({ me }: Props) {
  //   const { data: session } = useSession()
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [commentId, setCommentId] = useState<string>()
  const [isOpenDeleteCommentModal, setIsOpenDeleteCommentModal] =
    useState(false)
  const router = useRouter()
  const { id } = router.query
  const student = trpc.student.byId.useQuery(
    {
      id: id as string,
    },
    { enabled: router.isReady }
  )
  const deleteLessonPlanTRPC = trpc.lessonPlan.delete.useMutation()
  const deleteComment = trpc.lessonPlanComment.deleteById.useMutation()

  const lessonId = useRef("")
  const currentLessonPlan = useRef({})

  const handleDeleteModal = async (lessonPlanId: string) => {
    setIsOpenDeleteModal(true)
    lessonId.current = lessonPlanId
  }

  const deleteLessonPlan = async () => {
    try {
      await deleteLessonPlanTRPC.mutateAsync({
        id: lessonId.current,
      })
    } catch (error) {}
    setIsOpenDeleteModal(false)
  }

  const handleEditModal = async (lessonPlan: any) => {
    currentLessonPlan.current = lessonPlan
    setIsOpenEditModal(true)
  }

  const handleDeleteCommentModal = () => {
    setIsOpenDeleteCommentModal(true)
  }

  const deleteCommentEvent = async (commentId: string) => {
    try {
      await deleteComment.mutateAsync({
        id: commentId,
      })
    } catch (error) {
      console.log("Error deleting comment.", error)
    }
    setIsOpenDeleteCommentModal(false)
  }

  const addLessonPlanBtn = (
    <div>
      <div>
        <Button intent="primary" size="small" onClick={() => setIsOpen(true)}>
          + Add Lesson Plan
        </Button>
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          closeButton="Cancel"
          title="Add Lesson Plan"
          description={
            <AddLessonPlan
              studentId={student?.data?.id}
              teacherId={student?.data?.teacher?.id}
              closeModal={() => setIsOpen(false)}
              actorId={student?.data?.teacher?.email!}
              recipientId="spanishforuskids@gmail.com"
              studentName={`${student.data?.studentFirstName} ${student.data?.studentLastName}`}
              actionUrl={`/admin/students/${student?.data?.id}`}
            />
          }
        />
      </div>
    </div>
  )

  return (
    <div>
      {student.isLoading ? (
        <Loading />
      ) : (
        <div>
          {student.data?.lessonPlans.length == 0 ? (
            <div className="flex flex-col items-center justify-center gap-6 shadow bg-neutral-50 h-96 rounded-xl">
              <div className="text-6xl text-base-300">
                <HiOutlineFolderAdd />
              </div>
              <div className="flex flex-col items-center">
                <div className="font-bold">No lesson plans</div>
                <div className="">Get started by adding lesson plans.</div>
              </div>
              {addLessonPlanBtn}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex flex-col w-full">
                <div className="flex justify-end my-2">{addLessonPlanBtn}</div>
                {student.data?.lessonPlans &&
                  student.data.lessonPlans.map((lessonPlan, idx) => (
                    <div key={lessonPlan.id}>
                      <LessonPlan
                        title={lessonPlan.title}
                        date={lessonPlan.date}
                        slidesUrl={lessonPlan.slidesUrl}
                        homeworkSent={lessonPlan.homeworkSent}
                        handleDeleteModal={() =>
                          handleDeleteModal(lessonPlan.id)
                        }
                        handleEditModal={() => handleEditModal(lessonPlan)}
                        handleDeleteCommentModal={handleDeleteCommentModal}
                        comments={lessonPlan.comments}
                        setCommentId={setCommentId}
                        AddLessonPlanCommentInput={
                          <AddLessonPlanCommentInput
                            currentLessonPlan={lessonPlan}
                            user={me.data}
                          />
                        }
                        currentUserId={me.data?.id!}
                      />
                      <div className="h-12"></div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Edit Modal */}
      <Modal
        isOpen={isOpenEditModal}
        setIsOpen={setIsOpenEditModal}
        closeButton="Cancel"
        title="Edit Lesson Plan"
        description={
          <EditLessonPlan
            currentLessonPlan={currentLessonPlan.current}
            closeModal={() => setIsOpenEditModal(false)}
          />
        }
      />
      {/* Delete Modal */}
      <Modal
        isOpen={isOpenDeleteModal}
        setIsOpen={setIsOpenDeleteModal}
        loading={deleteLessonPlanTRPC.isLoading}
        loadingLabel="Deleting..."
        btnIntent="danger"
        currentData={id}
        actionFunction={deleteLessonPlan}
        closeButton="Cancel"
        actionButton="Delete"
        actionButtonLoading="Deleting..."
        actionButtonStyle="btn btn-error"
        title="Delete Lesson Plan"
        description={
          <div>
            <p className="mt-2">
              Are you sure you want to delete this lesson plan?
            </p>
          </div>
        }
      />
      {/* Delete Comment Modal */}
      <Modal
        isOpen={isOpenDeleteCommentModal}
        setIsOpen={setIsOpenDeleteCommentModal}
        loading={deleteComment.isLoading}
        loadingLabel="Deleting Comment..."
        btnIntent="danger"
        currentData={commentId}
        actionFunction={deleteCommentEvent}
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
    </div>
  )
}

LessonPlans.auth = true
