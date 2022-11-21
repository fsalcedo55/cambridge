import PageHeading from "@src/components/ui/pageHeading"
import { useRouter } from "next/router"
import { useRef, useState } from "react"
import Link from "next/link"
import { Tab } from "@headlessui/react"
import Loading from "@ui/loading"
import LoadingSkeleton from "@ui/loadingSkeleton"
import { useSession } from "next-auth/react"
import LessonPlan from "@components/lessonPlan"
import Modal from "@ui/modal"
import AddLessonPlan from "@components/addLessonPlan"
import { trpc } from "@src/utils/trpc"
import { HiOutlineFolderAdd } from "react-icons/hi"
import Image from "next/image"
import { Button } from "@ui/button"

type Student = {
  studentFirstName: string
  studentLastName: string
  userId: string
}

export default function AdminStudentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { id } = router.query
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const lessonId = useRef("")
  const student = trpc.student.byId.useQuery({
    id: id as string,
  })
  const addLessonPlan = trpc.lessonPlan.add.useMutation()
  const deleteLessonPlanTRPC = trpc.lessonPlan.delete.useMutation()

  const handleAddLessonPlan = async (values: any) => {
    try {
      await addLessonPlan.mutateAsync({
        title: values.title,
        date: values.date,
        studentId: id as string,
        userId: student.data?.teacher.id as string,
      })
    } catch (error) {
      console.log(error)
    }
    console.log("values: ", values)
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

  // const deleteLessonPlan = async () => {
  //   const body = lessonId.current
  //   try {
  //     const response = await fetch(`/api/lessonPlans/${body}`, {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(body),
  //     })
  //     if (response.status != 200) {
  //       console.log("Not able to delete lesson plan")
  //     } else {
  //       console.log("Lesson plan deleted")
  //       setIsOpenDeleteModal(false)
  //     }
  //   } catch (error) {
  //     console.log("Error deleting from API Call", error)
  //   }
  // }

  const addLessonPlanBtn = (
    <div>
      <Button intent="primary" onClick={() => setIsOpen(true)}>
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
  )

  if (session?.role === "admin") {
    return (
      <div>
        {student.isLoading ? (
          <div>
            <div className="text-sm breadcrumbs">
              <ul>
                <li>
                  <Link href="/admin/students">
                    <a className="hover:text-primary">Students</a>
                  </Link>
                </li>
                <li>
                  <LoadingSkeleton height="short" />
                </li>
              </ul>
            </div>
            <PageHeading pageTitle={<LoadingSkeleton />} />
          </div>
        ) : (
          <div>
            <div className="text-sm breadcrumbs">
              <ul>
                <li>
                  <Link href="/admin/students">
                    <a className="hover:text-primary">Students</a>
                  </Link>
                </li>
                <li>
                  <div>
                    {`${student.data?.studentFirstName} ${student.data?.studentLastName}`}
                  </div>
                </li>
              </ul>
            </div>
            <PageHeading
              userCard={true}
              pageTitle={`${student.data?.studentFirstName} ${student.data?.studentLastName}`}
              content={
                <div className="flex items-center gap-2">
                  <div className="avatar">
                    <div className="w-6 rounded-full">
                      {student.data?.teacher?.image ? (
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
                              isOpenDeleteModal={isOpenDeleteModal}
                              setIsOpenDeleteModal={setIsOpenDeleteModal}
                              deleteLessonPlan={deleteLessonPlan}
                              id={lessonPlan.id}
                              deleteLoading={deleteLessonPlanTRPC.isLoading}
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
      </div>
    )
  }
}

AdminStudentPage.auth = true
