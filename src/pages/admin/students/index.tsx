import { useSession } from "next-auth/react"
import PageHeading from "@src/components/ui/pageHeading"
import AddStudent from "@components/addStudent"
import { useState } from "react"
import Loading from "@ui/loading"
import Modal from "@ui/modal"
import Table from "@ui/table"
import { RiPencilLine, RiDeleteBinLine } from "react-icons/ri"
import { useRouter } from "next/router"
import Image from "next/image"
import { trpc } from "src/utils/trpc"

const studentTableHeaders = [
  { id: "header1", label: "" },
  { id: "header2", label: "Name" },
  { id: "header3", label: "Age" },
  { id: "header4", label: "Teacher" },
  { id: "header5", label: "" },
]

export default function Students() {
  const { data: session } = useSession()
  const router = useRouter()
  const students = trpc.student.getAll.useQuery()
  const teachers = trpc.teacher.getAll.useQuery()
  const addStudent = trpc.student.add.useMutation()
  const deleteStudent = trpc.student.deleteSingleStudent.useMutation()
  const [currentStudent, setCurrentStudent] = useState(null)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [isOpenAddModal, setIsOpenAddModal] = useState(false)

  const handleAddStudentModal = async (values: any) => {
    try {
      await addStudent.mutateAsync({
        studentFirstName: values.studentFirstName,
        studentLastName: values.studentLastName,
        studentDateOfBirth: values.studentDateOfBirth,
        userId: values.teacher,
      })
    } catch (error) {
      console.log("Error adding new student to the database.")
    }
    setIsOpenAddModal(false)
  }

  const handleDeleteModal = async (student: any) => {
    setIsOpenDeleteModal(true)
    setCurrentStudent(student)
  }

  const handleDelete = async (student: any) => {
    await deleteStudent.mutateAsync({
      id: student.id,
    })
    setIsOpenDeleteModal(false)
  }

  // Formatted rows for table cells
  const formattedRows = students.data?.map((student, idx: number) => ({
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
                  src={`${student.teacher?.image}`}
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
              onClick={() => handleDeleteModal(student)}
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

  if (session?.role === "admin") {
    return (
      <div>
        <PageHeading pageTitle="Students" />
        {students.isLoading ? (
          <Loading />
        ) : (
          <div>
            {/* Delete Modal */}
            <Modal
              isOpen={isOpenDeleteModal}
              setIsOpen={setIsOpenDeleteModal}
              loading={deleteStudent.isLoading}
              currentData={currentStudent}
              actionFunction={handleDelete}
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
                loading={addStudent.isLoading}
                closeButton="Cancel"
                title="Add Student"
                description={
                  <AddStudent
                    teachers={teachers.data}
                    handleSubmit={handleAddStudentModal}
                  />
                }
              />
            </div>
            {students.isLoading ? (
              <Loading />
            ) : (
              <Table headers={studentTableHeaders} rows={formattedRows} />
            )}

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
