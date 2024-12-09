import { useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Image from "next/image"
import { trpc } from "@src/utils/trpc"
import PageHeading from "@src/components/ui/pageHeading"
import EditLessonPlan from "@src/components/editLessonPlan"
import Loading from "@ui/loading"
import LoadingSkeleton from "@ui/loadingSkeleton"
import Modal from "@ui/modal"
import { ButtonLegacy } from "@ui/buttonLegacy"
import LessonPlan from "@components/lessonPlan"
import AddLessonPlan from "@components/addLessonPlan"
import { HiOutlineFolderAdd } from "react-icons/hi"
import AddLessonPlanCommentInput from "@components/addLessonPlanCommentInput"
import type { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import { type ILessonPlan } from "@src/interfaces/index"
import CurriculumDisclosure from "@src/components/curriculum/curriculumDisclosure"
import Breadcrumbs from "@src/components/ui/breadcrumbs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import type { User } from "@src/pages/admin/users"
import { toast } from "sonner"
import { Level } from "@src/components/curriculum/curriculumDisclosure"
type AdminStudentPageProps = {
  sessionSSR: {
    user: {
      email: string
    }
    role: string
  }
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSession(ctx)
  if (!session || session.role !== "admin") {
    return { redirect: { destination: "/", permanent: false } }
  }
  return {
    props: {
      sessionSSR: await getAuthSession(ctx),
    },
  }
}

export default function AdminStudentPage({
  sessionSSR,
}: AdminStudentPageProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { id, tab = "lessonPlans" } = router.query
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [isOpenDeleteCommentModal, setIsOpenDeleteCommentModal] =
    useState(false)
  const [commentId, setCommentId] = useState<string>()
  const lessonId = useRef("")
  const currentLessonPlan = useRef<ILessonPlan>({} as ILessonPlan)
  const student = trpc.student.byId.useQuery(
    {
      id: id as string,
    },
    { enabled: router.isReady }
  )

  const studentEntitlements = trpc.student.getEntitlementsByStudentId.useQuery(
    {
      id: id as string,
    },
    { enabled: router.isReady }
  )
  const deleteLessonPlanTRPC = trpc.lessonPlan.delete.useMutation()
  const deleteComment = trpc.lessonPlanComment.deleteById.useMutation()
  const me = trpc.user.me.useQuery({ email: sessionSSR.user.email })
  const lessonCompletion =
    trpc.lessonCompletion.getAllLessonCompletionsByStudentId.useQuery(
      {
        studentId: id as string,
      },
      {
        enabled: !!id,
      }
    )

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

  const handleEditModal = async (lessonPlan: ILessonPlan) => {
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
      toast.success("Comment deleted successfully")
    } catch (error) {
      toast.error("Failed to delete comment")
    }
    setIsOpenDeleteCommentModal(false)
  }

  const addLessonPlanBtn = (
    <div>
      {router.isReady ? (
        <div>
          <ButtonLegacy
            intent="primary"
            size="small"
            onClick={() => setIsOpen(true)}
          >
            + Add Lesson Plan
          </ButtonLegacy>
          {session?.user?.email && student?.data?.teacher?.email && (
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
                  actorId={session.user.email}
                  recipientId={student.data.teacher.email}
                  studentName={`${student.data?.studentFirstName} ${student.data?.studentLastName}`}
                  actionUrl={`/teacher/students/${student?.data?.id}`}
                />
              }
            />
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  )

  const pages = [
    { name: "Students", href: "/admin/students", current: false },
    {
      name: `${student.data?.studentFirstName} ${student.data?.studentLastName}`,
      current: true,
    },
  ]

  const tabPanel = (
    <nav
      className="h-full mt-3 overflow-y-auto rounded-3xl"
      aria-label="Directory"
    >
      <div>
        {studentEntitlements?.data && (
          <CurriculumDisclosure
            levelsArray={studentEntitlements.data as Level[]}
            studentId={student.data?.id}
            admin={true}
            edit={false}
            lessonCompletions={
              Array.isArray(lessonCompletion.data)
                ? lessonCompletion.data.reduce((acc, lessonId) => {
                    acc[lessonId] = true
                    return acc
                  }, {} as Record<string, boolean>)
                : {}
            }
          />
        )}
      </div>
    </nav>
  )

  const lessonPlans = (
    <div>
      {student.data?.lessonPlans.length === 0 ? (
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
        <div>
          <div className="flex justify-start my-3">{addLessonPlanBtn}</div>
          {student.data?.lessonPlans &&
            student.data?.lessonPlans.map((lessonPlan) => (
              <div key={lessonPlan.id}>
                {me.data?.id && (
                  <LessonPlan
                    title={lessonPlan.title}
                    date={lessonPlan.date}
                    slidesUrl={lessonPlan.slidesUrl}
                    homeworkSent={lessonPlan.homeworkSent}
                    handleDeleteModal={() => handleDeleteModal(lessonPlan.id)}
                    handleEditModal={() => handleEditModal(lessonPlan)}
                    handleDeleteCommentModal={handleDeleteCommentModal}
                    comments={lessonPlan.comments}
                    setCommentId={setCommentId}
                    AddLessonPlanCommentInput={
                      <AddLessonPlanCommentInput
                        currentLessonPlan={lessonPlan}
                        user={me.data as User}
                      />
                    }
                    currentUserId={me.data.id}
                  />
                )}
                <div className="h-12"></div>
              </div>
            ))}
        </div>
      )}
    </div>
  )

  const tabsTriggerData = [
    {
      id: 1,
      value: "lessonPlans",
      label: "Lesson Plans",
    },
    {
      id: 2,
      value: "curriculum",
      label: "Curriculum",
    },
  ]

  const handleTabChange = (newTab: string) => {
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: newTab },
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <div>
      <div>
        <div>
          <Breadcrumbs pages={pages} loading={student.isLoading} />
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
                    <div className="text-sm">{student.data?.teacher.name}</div>
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
        <Tabs
          defaultValue={tab as string}
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList>
            {tabsTriggerData.map((trigger) => (
              <TabsTrigger key={trigger.id} value={trigger.value}>
                {trigger.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="lessonPlans">{lessonPlans}</TabsContent>
          <TabsContent value="curriculum">{tabPanel}</TabsContent>
        </Tabs>
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
      {/* Delete Lesson Plan Modal */}
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
      {commentId && (
        <Modal
          isOpen={isOpenDeleteCommentModal}
          setIsOpen={setIsOpenDeleteCommentModal}
          loading={deleteComment.isLoading}
          loadingLabel="Deleting Comment..."
          btnIntent="danger"
          currentData={commentId}
          actionFunction={() => deleteCommentEvent(commentId)}
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
      )}
    </div>
  )
}

AdminStudentPage.auth = true
