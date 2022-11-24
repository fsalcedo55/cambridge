import { useEffect, useRef, useState } from "react"
import { getSession, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import { Tab } from "@headlessui/react"
import { trpc } from "@src/utils/trpc"
import PageHeading from "@src/components/ui/pageHeading"
import EditLessonPlan from "@src/components/editLessonPlan"
import Loading from "@ui/loading"
import LoadingSkeleton from "@ui/loadingSkeleton"
import Modal from "@ui/modal"
import { Button } from "@ui/button"
import LessonPlan from "@components/lessonPlan"
import AddLessonPlan from "@components/addLessonPlan"
import { HiOutlineFolderAdd } from "react-icons/hi"
import AddLessonPlanCommentInput from "@components/addLessonPlanCommentInput"
import type { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"

type Student = {
  studentFirstName: string
  studentLastName: string
  userId: string
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      sessionSSR: await getAuthSession(ctx),
    },
  }
}

export default function AdminStudentPage({ sessionSSR }: any) {
  const { data: session } = useSession()
  const router = useRouter()
  const { id } = router.query
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [isOpenAddCommentModal, setIsOpenAddCommentModal] = useState(false)
  const lessonId = useRef("")
  const currentLessonPlan = useRef({})
  const student = trpc.student.byId.useQuery(
    {
      id: id as string,
    },
    { enabled: router.isReady }
  )
  const addLessonPlan = trpc.lessonPlan.add.useMutation()
  const deleteLessonPlanTRPC = trpc.lessonPlan.delete.useMutation()
  const me = trpc.user.me.useQuery({ email: sessionSSR.user.email })

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

  const handleAddCommentModal = async (lessonPlan: any) => {
    currentLessonPlan.current = lessonPlan
    setIsOpenAddCommentModal(true)
  }

  const addLessonPlanBtn = (
    <div>
      {router.isReady ? (
        <div>
          <Button intent="primary" size="small" onClick={() => setIsOpen(true)}>
            + Add Lesson Plan
          </Button>
          <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            loading={isLoading}
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
      ) : (
        ""
      )}
    </div>
  )

  console.log(student.data)

  if (session?.role === "admin") {
    return (
      <div>
        <div>
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link href="/admin/students">
                  <a className="hover:text-primary">Students</a>
                </Link>
              </li>
              <li>
                {student.isLoading ? (
                  <LoadingSkeleton height="short" />
                ) : (
                  <div>
                    {`${student.data?.studentFirstName} ${student.data?.studentLastName}`}
                  </div>
                )}
              </li>
            </ul>
          </div>
          {student.isLoading ? (
            <PageHeading pageTitle={<LoadingSkeleton />} />
          ) : (
            <div>
              <PageHeading
                userCard={true}
                pageTitle={`${student.data?.studentFirstName} ${student.data?.studentLastName}`}
                content={
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="w-6 rounded-full">
                        {student.data?.teacher?.image && router.isReady ? (
                          <Image
                            src={`${student.data?.teacher.image}`}
                            width={24}
                            height={24}
                            alt={"teacher"}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    {student.data?.teacher?.name ? (
                      <div className="text-sm">
                        {student.data?.teacher.name}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                }
              />
            </div>
          )}
        </div>

        {student.isLoading ? (
          <Loading />
        ) : (
          <div>
            {student.data?.lessonPlans.length == 0 ? (
              <div className="flex flex-col items-center justify-center gap-6 shadow h-96 rounded-xl">
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
              <div>
                <Tab.Group>
                  <div className="flex items-center justify-between">
                    <Tab.List className="tabs">
                      <Tab className="pl-0 pr-8 mb-4 tab tab-lg tab-bordered ui-selected:tab-active ui-selected:font-semibold">
                        Lesson Plans
                      </Tab>
                      <Tab className="pl-0 pr-8 mb-4 tab tab-lg tab-bordered ui-selected:tab-active ui-selected:font-semibold">
                        Settings
                      </Tab>
                    </Tab.List>

                    <div className="flex justify-end my-2">
                      {addLessonPlanBtn}
                    </div>
                  </div>

                  <Tab.Panels>
                    <Tab.Panel className="flex flex-col gap-4">
                      {student.data?.lessonPlans &&
                        student.data?.lessonPlans.map((lessonPlan) => (
                          <div key={lessonPlan.id}>
                            <LessonPlan
                              title={lessonPlan.title}
                              date={lessonPlan.date}
                              handleDeleteModal={() =>
                                handleDeleteModal(lessonPlan.id)
                              }
                              handleEditModal={() =>
                                handleEditModal(lessonPlan)
                              }
                              handleAddCommentModal={() =>
                                handleAddCommentModal(lessonPlan)
                              }
                              comments={lessonPlan.comments}
                            />
                          </div>
                        ))}
                    </Tab.Panel>
                    <Tab.Panel>Settings go here</Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            )}
          </div>
        )}
        {/* Add Comment Modal */}
        <Modal
          isOpen={isOpenAddCommentModal}
          setIsOpen={setIsOpenAddCommentModal}
          title="Post a comment"
          closeButton="Cancel"
          description={
            <AddLessonPlanCommentInput
              currentLessonPlan={currentLessonPlan.current}
              closeModal={() => setIsOpenAddCommentModal(false)}
              userId={me.data?.id}
            />
          }
        />
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
}

AdminStudentPage.auth = true
