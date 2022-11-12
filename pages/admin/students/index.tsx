import { useSession } from "next-auth/react"
import PageHeading from "../../../components/pageHeading"
import AddStudent from "../../../components/addStudent"
import { useState } from "react"
import Loading from "../../../components/ui/loading"
import Modal from "@ui/modal"
import Table from "@ui/Table"
import { RiPencilLine, RiDeleteBinLine } from "react-icons/ri"
import { useRouter } from "next/router"
import Image from "next/image"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllStudents } from "@services/students.services"
import { getAllTeachers } from "@services/teachers.services"

interface Student {
  studentFirstName: string
  studentLastName: string
  studentDateOfBirth: string
  userId: string
  id: string
  teacher: {
    id: string
    name: string
    email: string
    emailVerified: null
    image: string
    role: string
  }
}

const studentTableHeaders = [
  { id: "header1", label: "" },
  { id: "header2", label: "Name" },
  { id: "header3", label: "Age" },
  { id: "header4", label: "Teacher" },
  { id: "header5", label: "" },
]

export default function Students() {
  const queryClient = useQueryClient()

  const {
    data: students,
    isLoading: studentsIsLoading,
    isError: studentsIsError,
  } = useQuery(["students"], getAllStudents)

  const {
    data: teachers,
    isLoading: teachersIsLoading,
    isError: teachersIsError,
  } = useQuery(["teachers"], getAllTeachers)

  const { data: session } = useSession()
  const [isLoadingState, setIsLoadingState] = useState(false)
  const [currentStudent, setCurrentStudent] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [isOpenAddModal, setIsOpenAddModal] = useState(false)
  const router = useRouter()

  // Formatted rows for table cells
  const formattedRows = students?.map((student: Student, idx: number) => ({
    cells: [
      { content: idx + 1 },
      {
        content: `${student.studentFirstName} ${student.studentLastName}`,
        href: `/admin/students/${student.id}`,
      },
      { content: `${student.studentDateOfBirth}` },
      {
        content: (
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
        ),
      },
      {
        content: (
          <div className="flex gap-2 text-xl text-base-300">
            <div
              className="hover:text-primary tooltip tooltip-left"
              data-tip="Edit"
            >
              <RiPencilLine />
            </div>
            <div
              onClick={() => handleDelete(student)}
              className="hover:text-error tooltip tooltip-error tooltip-right"
              data-tip="Delete"
            >
              <RiDeleteBinLine />
            </div>
          </div>
        ),
      },
    ],
  }))

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
        queryClient.invalidateQueries({ queryKey: ["students"] })
      }
    } catch (error) {
      console.log(error)
    }
    setDeleteLoading(false)
  }

  const addStudent = async (values: any) => {
    setIsLoadingState(true)

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
        queryClient.invalidateQueries({ queryKey: ["students"] })
        //set a success banner here
      }
      //check response, if success is false, dont take them to success page
    } catch (error) {
      console.log("Error submitting the 'Add Student' form.", error)
    }
    setIsLoadingState(false)
  }

  if (session?.role === "admin") {
    return (
      <div>
        <PageHeading pageTitle="Students" />
        {isLoadingState ? (
          <Loading />
        ) : (
          <div>
            {/* Delete Modal */}
            <Modal
              isOpen={isOpenDeleteModal}
              setIsOpen={setIsOpenDeleteModal}
              loading={deleteLoading}
              currentData={currentStudent}
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
                    Are you sure you want to delete this student? All of the
                    data will be permanently removed. This action cannot be
                    undone.
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
                loading={isLoadingState}
                currentData={currentStudent}
                actionFunction={addStudent}
                closeButton="Cancel"
                title="Add Student"
                description={
                  <AddStudent teachers={teachers} handleSubmit={addStudent} />
                }
              />
            </div>
            <Table headers={studentTableHeaders} rows={formattedRows} />

            <div className="overflow-x-auto"></div>
          </div>
        )}
      </div>
    )
    // } else {
    //   router.push("/")
  }
}

Students.auth = true
