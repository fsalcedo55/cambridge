import { useRef, useState } from "react"
import { useSession } from "next-auth/react"
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
import { ILessonPlan } from "@src/interfaces/index"
import Breadcrumbs from "@src/components/ui/breadcrumbs"
import { SiBookstack } from "react-icons/si"
import AddLevel from "@src/components/admin/lessons/AddLevel"

type Student = {
  studentFirstName: string
  studentLastName: string
  userId: string
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSession(ctx)
  if (!session || session.role != "admin") {
    return { redirect: { destination: "/", permanent: false } }
  }
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
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [isOpenDeleteCommentModal, setIsOpenDeleteCommentModal] =
    useState(false)
  const [commentId, setCommentId] = useState<string>()
  const lessonId = useRef("")
  const currentLessonPlan = useRef({})
  const student = trpc.student.byId.useQuery(
    {
      id: id as string,
    },
    { enabled: router.isReady }
  )
  const deleteLessonPlanTRPC = trpc.lessonPlan.delete.useMutation()
  const deleteComment = trpc.lessonPlanComment.deleteById.useMutation()
  const me = trpc.user.me.useQuery({ email: sessionSSR.user.email })

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
    } catch (error) {
      console.log(error)
    }
    setIsOpenDeleteCommentModal(false)
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
            closeButton="Cancel"
            title="Add Lesson Plan"
            description={
              <AddLessonPlan
                studentId={student?.data?.id}
                teacherId={student?.data?.teacher?.id}
                closeModal={() => setIsOpen(false)}
                actorId={session?.user?.email!}
                recipientId={student?.data?.teacher?.email!}
                studentName={`${student.data?.studentFirstName} ${student.data?.studentLastName}`}
                actionUrl={`/teacher/students/${student?.data?.id}`}
              />
            }
          />
        </div>
      ) : (
        ""
      )}
    </div>
  )

  const addLevelBtn = (
    <div>
      {router.isReady ? (
        <div>
          <Button intent="primary" size="small" onClick={() => setIsOpen(true)}>
            + Add Level
          </Button>
          <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            closeButton="Cancel"
            title="Add Level"
            description={<AddLevel closeModal={() => setIsOpen(false)} />}
          />
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

  const directory: any = {
    Beginner: [
      {
        id: 1,
        name: "Basics",
        description: "Unit 1",
        imageUrl:
          "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      },
      {
        id: 2,
        name: "Mi Casa y Mi Familia",
        description: "Unit 2",
        imageUrl:
          "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2178&q=80",
      },
      {
        id: 3,
        name: "Mis Emociones",
        description: "Unit 3",
        imageUrl:
          "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      },
      {
        id: 4,
        name: "Mi Cuerpo Y Mi Ropa",
        description: "Unit 4",
        imageUrl:
          "https://images.unsplash.com/photo-1540479859555-17af45c78602?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      },
      {
        id: 5,
        name: "Animales de la Granja",
        description: "Unit 5",
        imageUrl:
          "https://images.unsplash.com/photo-1484557985045-edf25e08da73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1673&q=80",
      },
      {
        id: 6,
        name: "La Comida",
        description: "Unit 6",
        imageUrl:
          "https://images.unsplash.com/photo-1467224298296-81a33a3f3022?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1713&q=80",
      },
      {
        id: 7,
        name: "Medios de Transporte y La Ciudad",
        description: "Unit 7",
        imageUrl:
          "https://images.unsplash.com/photo-1564515113542-6e10f334cef4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80",
      },
      {
        id: 8,
        name: "Animales Salvajes",
        description: "Unit 8",
        imageUrl:
          "https://images.unsplash.com/photo-1509973301519-9ca52aa49658?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      },
      {
        id: 9,
        name: "Ayudantes de la Comunidad",
        description: "Unit 9",
        imageUrl:
          "https://images.unsplash.com/photo-1606613817011-84d20b0959ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80",
      },
      {
        id: 10,
        name: "Conceptos Especiales",
        description: "Unit 10",
        imageUrl:
          "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80",
      },
      {
        id: 11,
        name: "El Clima",
        description: "Unit 11",
        imageUrl:
          "https://images.unsplash.com/photo-1553984840-ec965a23cddd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80",
      },
      {
        id: 12,
        name: "Que Podemos Hacer?",
        description: "Unit 12",
        imageUrl:
          "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1738&q=80",
      },
      {
        id: 13,
        name: "Animales Marinos",
        description: "Unit 12",
        imageUrl:
          "https://images.unsplash.com/photo-1473849436913-eded203618b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1729&q=80",
      },
    ],
    Intermediate: [
      {
        id: 14,
        name: "Mi Cuerpo Y Mi Ropa",
        description: "Unit 4",
        imageUrl:
          "https://images.unsplash.com/photo-1540479859555-17af45c78602?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      },
      {
        id: 15,
        name: "Animales de la Granja",
        description: "Unit 5",
        imageUrl:
          "https://images.unsplash.com/photo-1484557985045-edf25e08da73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1673&q=80",
      },
      {
        id: 16,
        name: "La Comida",
        description: "Unit 6",
        imageUrl:
          "https://images.unsplash.com/photo-1467224298296-81a33a3f3022?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1713&q=80",
      },
    ],
    Advanced: [
      {
        id: 17,
        name: "Que Podemos Hacer?",
        description: "Unit 12",
        imageUrl:
          "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1738&q=80",
      },
      {
        id: 18,
        name: "Animales Marinos",
        description: "Unit 12",
        imageUrl:
          "https://images.unsplash.com/photo-1473849436913-eded203618b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1729&q=80",
      },
    ],
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
            <div>
              <Tab.Group>
                <div className="flex items-center justify-between">
                  <Tab.List className="tabs">
                    <Tab className="pl-0 pr-8 tab tab-md tab-bordered ui-selected:tab-active ui-selected:font-semibold">
                      Lesson Plans
                    </Tab>
                    <Tab className="pl-0 pr-8 tab tab-md tab-bordered ui-selected:tab-active ui-selected:font-semibold">
                      Lessons
                    </Tab>
                  </Tab.List>
                </div>

                <Tab.Panels>
                  <Tab.Panel className="flex flex-col">
                    <div className="flex justify-start my-3">
                      {addLessonPlanBtn}
                    </div>
                    {student.data?.lessonPlans &&
                      student.data?.lessonPlans.map((lessonPlan, idx) => (
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
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="flex justify-start my-3">{addLevelBtn}</div>
                    <nav
                      className="h-full mt-3 overflow-y-auto"
                      aria-label="Directory"
                    >
                      {Object.keys(directory).map((letter) => (
                        <div key={letter} className="relative">
                          <div className="sticky top-0 z-10 px-6 py-1 text-sm font-medium border-t border-b text-neutral-500 border-neutral-200 bg-primary-50">
                            <h3 className="text-xl font-bold text-primary-800">
                              {letter}
                            </h3>
                          </div>
                          <ul
                            role="list"
                            className="relative z-0 divide-y divide-neutral-200"
                          >
                            {directory[letter].map((person: any) => (
                              <li
                                key={person.id}
                                className="bg-white hover:bg-neutral-50"
                              >
                                <a href="#">
                                  <div className="flex items-center justify-between ">
                                    <div className="relative flex items-center px-6 py-2 space-x-3 ">
                                      <div className="flex-shrink-0">
                                        <Image
                                          height={120}
                                          width={175}
                                          src={person.imageUrl}
                                          alt=""
                                          className="rounded-lg"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-2xl font-bold md:text-2xl text-primary-800">
                                          {person.name}
                                        </p>
                                        <p className="font-bold truncate text-neutral-500">
                                          {person.description}
                                        </p>
                                        <div className="flex items-center gap-1 text-sm truncate text-neutral-500">
                                          <SiBookstack />
                                          <span>12 Lessons</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col px-8">
                                      <span className="text-xs text-neutral-300">
                                        Completed
                                      </span>
                                      <span className="text-3xl">56%</span>
                                    </div>
                                  </div>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </nav>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
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

AdminStudentPage.auth = true
