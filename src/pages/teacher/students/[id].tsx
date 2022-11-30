import { useRouter } from "next/router"
import { trpc } from "@src/utils/trpc"
import LessonPlan from "@src/components/lessonPlan"
import AddLessonPlanCommentInput from "@src/components/addLessonPlanCommentInput"
import type { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import { useEffect, useRef, useState } from "react"
import PageHeadingWithBreadcrumb from "@src/components/ui/pageHeadingWithBreadcrumb"
import { Button } from "@src/components/ui/button"
import Modal from "@src/components/ui/modal"
import AddLessonPlan from "@src/components/addLessonPlan"
import Loading from "@src/components/ui/loading"
import { HiOutlineFolderAdd } from "react-icons/hi"
import EditLessonPlan from "@src/components/editLessonPlan"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      sessionSSR: await getAuthSession(ctx),
    },
  }
}

export default function TeacherStudentPage({ sessionSSR }: any) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { id } = router.query
  const student = trpc.student.byId.useQuery(
    {
      id: id as string,
    },
    { enabled: router.isReady }
  )
  const me = trpc.user.me.useQuery({ email: sessionSSR.user.email })
  const addLessonPlan = trpc.lessonPlan.add.useMutation()
  const deleteLessonPlanTRPC = trpc.lessonPlan.delete.useMutation()
  const lessonId = useRef("")
  const currentLessonPlan = useRef({})

  const pages = [
    { name: "Students", href: "/teacher/students", current: false },
    {
      name: `${student.data?.studentFirstName} ${student.data?.studentLastName}`,
      href: `/teacher/students/${student.data?.id}`,
      current: true,
    },
  ]

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

  const handleAddLessonPlan = async (values: any) => {
    try {
      await addLessonPlan.mutateAsync({
        title: values.title,
        date: values.date,
        studentId: id as string,
        userId: student?.data?.teacher!.id as string,
      })
    } catch (error) {
      console.log(error)
    }
    setIsOpen(false)
  }

  const addLessonPlanBtn = (
    <div>
      {/* {router.isReady ? ( */}
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
              handleSubmit={handleAddLessonPlan}
              btnLoading={addLessonPlan.isLoading}
              btnLabel="Adding Lesson Plan..."
            />
          }
        />
      </div>
      {/* // ) : (
      //   ""
      // )} */}
    </div>
  )

  return (
    <div>
      <PageHeadingWithBreadcrumb
        pages={pages}
        pageTitle={student.data?.studentFirstName}
        loading={student.isLoading}
      />
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
              <div className="flex flex-col gap-3 w-[50rem]">
                <div className="flex justify-end my-2">{addLessonPlanBtn}</div>
                {student.data?.lessonPlans &&
                  student.data.lessonPlans
                    .slice(0)
                    .reverse()
                    .map((lessonPlan, idx) => (
                      <div key={lessonPlan.id}>
                        <LessonPlan
                          title={lessonPlan.title}
                          date={lessonPlan.date}
                          handleDeleteModal={() =>
                            handleDeleteModal(lessonPlan.id)
                          }
                          handleEditModal={() => handleEditModal(lessonPlan)}
                          comments={lessonPlan.comments}
                          AddLessonPlanCommentInput={
                            <AddLessonPlanCommentInput
                              currentLessonPlan={lessonPlan}
                              user={me.data}
                            />
                          }
                          currentUserId={me.data?.id!}
                        />
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
    </div>
  )
}

TeacherStudentPage.auth = true
