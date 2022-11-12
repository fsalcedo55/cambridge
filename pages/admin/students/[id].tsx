import PageHeading from "../../../components/pageHeading"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Tab } from "@headlessui/react"
import Loading from "../../../components/ui/loading"
import { useSession } from "next-auth/react"
import LessonPlan from "../../../components/lessonPlan"
import Modal from "@ui/modal"
import AddLessonPlan from "../../../components/addLessonPlan"

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
  const [studentData, setStudentData] = useState<Student>({
    studentFirstName: "",
    studentLastName: "",
    userId: "",
  })
  const [isOpen, setIsOpen] = useState(false)
  const [lessonPlans, setLessonPlans] = useState<any[]>([])
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [currentLessonPlan, setCurrentLessonPlan] = useState("")
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)
  const lessonId = useRef("")

  useEffect(() => {
    if (router.isReady) {
      getStudent()
      getLessonPlans()
    }
  }, [router.isReady])

  useEffect(() => {
    console.log("currentLessonPlan inside useeffect: ", currentLessonPlan)
  }, [currentLessonPlan])

  const handleDeleteModal = (lessonPlanId: string) => {
    setIsOpenDeleteModal(true)
    lessonId.current = lessonPlanId
  }

  const deleteLessonPlan = async () => {
    setIsLoadingDelete(true)
    const body = lessonId.current
    try {
      const response = await fetch(`/api/lessonPlans/${body}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (response.status != 200) {
        console.log("Not able to delete lesson plan")
      } else {
        console.log("Lesson plan deleted")
        setIsOpenDeleteModal(false)
        getLessonPlans()
      }
    } catch (error) {
      console.log("Error deleting from API Call", error)
    }
    setIsLoadingDelete(false)
  }

  const getStudent = async () => {
    setIsLoading(true)
    console.log("there is an ID: ", id)
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "force-cache",
      })
      const data = await response.json()
      setStudentData(data.uniqueStudent)
      if (response.status != 200) {
        console.log("response status does not equal 200")
      } else {
        console.log("Got student data!")
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const addLessonPlan = async (values: any) => {
    setIsLoading(true)
    const body = { ...values, studentId: id, userId: studentData.userId }
    console.log("body: ", body)
    try {
      const response = await fetch(`/api/lessonPlans/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (response.status != 200) {
        console.log("Error adding lesson plan")
      } else {
        console.log("New lesson plan added to the database")
        setIsOpen(false)
        getLessonPlans()
      }
    } catch (error) {
      console.log("Error submitting the 'Add Lesson Plan' form.", error)
    }
    setIsLoading(false)
  }

  const getLessonPlans = async () => {
    try {
      const response = await fetch(`/api/lessonPlans/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      setLessonPlans(data.lessonPlans)
    } catch (error) {
      console.log(error)
    }
  }

  console.log("lessonPlans: ", lessonPlans)

  if (session?.role === "admin") {
    return (
      <div>
        {studentData ? (
          <div>
            <div className="text-sm breadcrumbs">
              <ul>
                <li>
                  <Link href="/admin/students">
                    <a className="hover:text-primary">Students</a>
                  </Link>
                </li>
                <li>
                  <p>
                    {`${studentData?.studentFirstName} ${studentData?.studentLastName}`}
                  </p>
                </li>
              </ul>
            </div>
            <PageHeading
              pageTitle={`${studentData?.studentFirstName} ${studentData?.studentLastName}`}
            />
          </div>
        ) : (
          <Loading />
        )}

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
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsOpen(true)}
              >
                + Add Lesson Plan
              </button>
              <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                loading={isLoading}
                // actionFunction={addStudent}
                closeButton="Cancel"
                title="Add Lesson Plan"
                description={<AddLessonPlan handleSubmit={addLessonPlan} />}
              />
            </div>
          </div>
          <Tab.Panels>
            <Tab.Panel className="flex flex-col gap-4">
              {lessonPlans &&
                lessonPlans.map((lessonPlan) => (
                  <div key={lessonPlan.id}>
                    <LessonPlan
                      title={lessonPlan.title}
                      date={lessonPlan.date}
                      handleDeleteModal={() => handleDeleteModal(lessonPlan.id)}
                      isOpenDeleteModal={isOpenDeleteModal}
                      setIsOpenDeleteModal={setIsOpenDeleteModal}
                      deleteLessonPlan={deleteLessonPlan}
                      id={lessonPlan.id}
                    />
                  </div>
                ))}
            </Tab.Panel>
            <Tab.Panel>Settings go here</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    )
  }
}

AdminStudentPage.auth = true
