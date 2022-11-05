import Layout from "../../../components/layout"
import { useSession } from "next-auth/react"
import PageHeading from "../../../components/pageHeading"
import AddStudent from "../../../components/addStudent"
import { useEffect, useState } from "react"
import Loading from "../../../components/loading"
import Modal from "../../../components/modal"
import { RiPencilLine, RiDeleteBinLine } from "react-icons/ri"
import Link from "next/link"
import { useRouter } from "next/router"
import AccessDenied from "../../../components/access-denied"
import Image from "next/image"

export default function Students() {
  const { data: session } = useSession()
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentStudent, setCurrentStudent] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [isOpenAddModal, setIsOpenAddModal] = useState(false)
  const [teachers, setTeachers] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    getAllStudents()
    getAllTeachers()
  }, [])

  const handleDelete = async (student: any) => {
    setIsOpenDeleteModal(true)
    setCurrentStudent(student)
  }

  const deleteStudent = async (student: any) => {
    setDeleteLoading(true)
    const body = { student }
    try {
      const response = await fetch("/api/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (response.status !== 200) {
        console.log("Not able to delete student")
      } else {
        console.log("Student deleted succesfully")
        setIsOpenDeleteModal(false)
        getAllStudents()
      }
    } catch (error) {
      console.log(error)
    }
    setDeleteLoading(false)
  }

  const getAllStudents = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/students", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "force-cache",
      })
      const data = await response.json()
      setStudents(data.allStudents)
      if (response.status != 200) {
        console.log("Something is wrong")
      } else {
        console.log("Got all students!")
      }
    } catch (error) {
      console.log("Error reading from database: ", error)
    }
    setIsLoading(false)
  }

  const getAllTeachers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/teachers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      setTeachers(data.allTeachers)
    } catch (error) {
      console.log("Error getting all teachers", error)
    }
    setIsLoading(false)
  }

  const addStudent = async (values: any) => {
    setIsLoading(true)

    const body = { ...values }
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (response.status !== 200) {
        console.log("Error adding student to database")
        //set an error banner here
      } else {
        console.log("New student added to the database")
        setIsOpenAddModal(false)
        getAllStudents()
        //set a success banner here
      }
      //check response, if success is false, dont take them to success page
    } catch (error) {
      console.log("Error submitting the 'Add Student' form.", error)
    }
    setIsLoading(false)
  }

  if (session?.role != "admin") {
    return <AccessDenied />
  }

  // if (session?.role === "admin") {
  return (
    <Layout>
      <PageHeading pageTitle="Students" />
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {/* Delete Modal */}
          <Modal
            isOpen={isOpenDeleteModal}
            setIsOpen={setIsOpenDeleteModal}
            loading={deleteLoading}
            currentStudent={currentStudent}
            actionFunction={deleteStudent}
            closeButton="Cancel"
            actionButton="Delete"
            actionButtonLoading="Deleting"
            actionButtonStyle="btn btn-error"
            title="Delete Student"
            description={
              <div>
                <p>This will permanently delete this student</p>
                <p className="mt-2">
                  Are you sure you want to delete this student? All of the data
                  will be permanently removed. This action cannot be undone.
                </p>
              </div>
            }
          />
          <div className="flex justify-end my-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsOpenAddModal(true)}
            >
              + Add Student
            </button>
            {/* Add Student Modal */}
            <Modal
              isOpen={isOpenAddModal}
              setIsOpen={setIsOpenAddModal}
              loading={isLoading}
              currentStudent={currentStudent}
              actionFunction={addStudent}
              closeButton="Cancel"
              title="Add Student"
              description={
                <AddStudent teachers={teachers} handleSubmit={addStudent} />
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full shadow table-zebra table-compact">
              {/* <!-- head --> */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Teacher</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* <!-- row --> */}

                {students?.map((student, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <Link href={`/admin/students/${student.id}`}>
                        <a className="font-bold link link-hover hover:text-primary">{`${student.studentFirstName} ${student.studentLastName}`}</a>
                      </Link>
                    </td>
                    <td>{student.studentDateOfBirth}</td>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-6 rounded-full">
                            <Image
                              src={student.teacher?.image}
                              width={24}
                              height={24}
                              alt={"teacher"}
                            />
                          </div>
                        </div>
                        <div>
                          <div>{student.teacher?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="text-xl text-base-300 hover:text-primary tooltip tooltip-left"
                          data-tip="Edit"
                        >
                          <RiPencilLine />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(student)}
                          className="text-xl text-base-300 hover:text-error tooltip tooltip-error tooltip-right"
                          data-tip="Delete"
                        >
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  )
  // } else {
  //   router.push("/")
  // }
}
