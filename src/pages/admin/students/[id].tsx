import { Fragment, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import { Disclosure, Menu, Tab, Transition } from "@headlessui/react"
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
import AddUnit from "@src/components/admin/lessons/AddUnit"
import {
  CheckIcon,
  HandThumbUpIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiCheckboxCircleLine,
  RiDeleteBinLine,
  RiPencilLine,
} from "react-icons/ri"
import { TfiMoreAlt } from "react-icons/tfi"

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
  const [isOpenLevelBtn, setIsOpenLevelBtn] = useState(false)
  const [isOpenUnitBtn, setIsOpenUnitBtn] = useState(false)
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
  const levels = trpc.level.getAll.useQuery()

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
      <Button
        intent="primary"
        size="small"
        onClick={() => setIsOpenLevelBtn(true)}
      >
        + Add Level
      </Button>
      <Modal
        isOpen={isOpenLevelBtn}
        setIsOpen={setIsOpenLevelBtn}
        closeButton="Cancel"
        title="Add Levelhh"
        description={<AddLevel closeModal={() => setIsOpenLevelBtn(false)} />}
      />
    </div>
  )

  const addUnitBtn = (
    <div>
      <Button
        intent="primary"
        size="small"
        onClick={() => setIsOpenUnitBtn(true)}
      >
        + Add Unit
      </Button>
      <Modal
        isOpen={isOpenUnitBtn}
        setIsOpen={setIsOpenUnitBtn}
        closeButton="Cancel"
        title="Add Unit"
        description={
          <AddUnit
            closeModal={() => setIsOpenUnitBtn(false)}
            levelsArray={levels.data}
          />
        }
      />
    </div>
  )

  const pages = [
    { name: "Students", href: "/admin/students", current: false },
    {
      name: `${student.data?.studentFirstName} ${student.data?.studentLastName}`,
      current: true,
    },
  ]

  const people = [
    {
      name: "Partes del Cuerpo",
      completed: true,
      imageUrl:
        "https://images.unsplash.com/photo-1529155656340-c2c1cccb3dd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1725&q=80",
    },
    {
      name: "Ropa de Invierno",
      completed: false,
      imageUrl:
        "https://images.unsplash.com/photo-1613299469142-fa7d42740685?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1756&q=80",
    },
  ]

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ")
  }

  return (
    <div>
      <div>
        {/* <div>
          <Breadcrumbs pages={pages} loading={student.isLoading} />
        </div> */}

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
                    <div className="flex justify-start gap-3 my-3">
                      {addLevelBtn} {addUnitBtn}
                    </div>
                    <nav
                      className="h-full mt-3 overflow-y-auto"
                      aria-label="Directory"
                    >
                      {levels &&
                        levels?.data?.map((level) => (
                          <div key={level.id} className="relative">
                            <div className="sticky top-0 z-10 flex justify-between px-6 py-1 text-sm font-medium border-t border-b text-neutral-500 border-neutral-200 bg-primary-50">
                              <h3 className="text-xl font-bold text-primary-800">
                                {level.title}
                              </h3>
                            </div>
                            <ul
                              role="list"
                              className="relative z-0 divide-y divide-neutral-200"
                            >
                              {level.Unit.map((unit: any) => (
                                <li
                                  key={unit.id}
                                  className="bg-white hover:bg-neutral-50"
                                >
                                  <Disclosure>
                                    <Disclosure.Button
                                      as="div"
                                      className="flex items-center justify-between cursor-pointer"
                                    >
                                      <div className="relative flex items-center px-6 py-2 space-x-3 ">
                                        <div className="flex-shrink-0">
                                          <Image
                                            height={120}
                                            width={175}
                                            src={unit.photoUrl}
                                            alt=""
                                            className="rounded-lg"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-2xl font-bold md:text-2xl text-primary-800">
                                            {unit.title}
                                          </p>
                                          <p className="font-bold truncate text-neutral-500">
                                            Unit {unit.number}
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
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="p-6 bg-white text-neutral-500">
                                      <div className="flex flex-col gap-4">
                                        {people.map((person) => (
                                          <div
                                            key={person.name}
                                            className="flex justify-between"
                                          >
                                            <div className="relative flex items-center min-w-full p-3 space-x-3 bg-white border rounded-lg shadow-sm border-neutral-100 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:border-neutral-400">
                                              <div className="flex-shrink-0">
                                                <Image
                                                  height={80}
                                                  width={125}
                                                  className="rounded"
                                                  src={person.imageUrl}
                                                  alt=""
                                                />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <a
                                                  href="#"
                                                  className="focus:outline-none"
                                                >
                                                  <span
                                                    className="absolute inset-0"
                                                    aria-hidden="true"
                                                  />
                                                  <p className="text-lg font-bold text-neutral-900">
                                                    {person.name}
                                                  </p>
                                                </a>
                                              </div>
                                              {person.completed ? (
                                                <div className="p-3 text-4xl text-green-500">
                                                  <RiCheckboxCircleFill />
                                                </div>
                                              ) : (
                                                <div className="p-3 text-4xl text-neutral-500">
                                                  <RiCheckboxBlankCircleLine />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </Disclosure.Panel>
                                  </Disclosure>
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
