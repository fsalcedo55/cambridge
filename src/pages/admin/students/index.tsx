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
import EditStudentForm from "@src/components/editStudentForm"
import { Button } from "@ui/button"
import { getAge } from "@src/helpers/date"

const studentTableHeaders = [
  { id: "header1", label: "" },
  { id: "header2", label: "Name" },
  { id: "header3", label: "Age" },
  { id: "header4", label: "Teacher" },
  { id: "header5", label: "Status" },
  { id: "header6", label: "Actions" },
]

export default function Students() {
  const { data: session } = useSession()
  const router = useRouter()
  const students = trpc.student.getAll.useQuery()
  const teachers = trpc.teacher.getAll.useQuery()
  const addStudent = trpc.student.add.useMutation()
  const deleteStudent = trpc.student.deleteStudent.useMutation()
  const editStudent = trpc.student.editStudent.useMutation()
  const [currentStudent, setCurrentStudent] = useState<any>(null)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [isOpenAddModal, setIsOpenAddModal] = useState(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)

  const handleAddStudentModal = async (values: any) => {
    try {
      await addStudent.mutateAsync({
        studentFirstName: values.studentFirstName,
        studentLastName: values.studentLastName,
        studentDateOfBirth: values.studentDateOfBirth,
        userId: values.teacher,
        status: values.status,
      })
    } catch (error) {
      console.log("Error adding new student to the database.")
    }
    setIsOpenAddModal(false)
  }

  const handleEditModal = async (student: any) => {
    setIsOpenEditModal(true)
    setCurrentStudent(student)
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
        content: (
          <div>
            <div className="text-lg">
              {student.studentFirstName} {student.studentLastName}
            </div>
            <div className="text-sm font-light text-neutral-400">
              {student.lessonPlans.length > 0 ? (
                <div>
                  <span className="font-bold">
                    {student.lessonPlans.length}
                  </span>{" "}
                  lesson plans
                </div>
              ) : (
                <div className="text-sm font-light text-neutral-200">
                  0 lesson plans
                </div>
              )}{" "}
            </div>
          </div>
        ),
        href: `/admin/students/${student.id}`,
      },
      {
        content: `${getAge(student.studentDateOfBirth, true)}`,
      },
      {
        content: (
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="w-6 rounded-full">
                {student.teacher?.image ? (
                  <Image
                    src={`${student.teacher?.image}`}
                    width={24}
                    height={24}
                    alt={"teacher"}
                  />
                ) : (
                  ""
                )}
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
          <div>
            {student.status == "Active" ? (
              <span className="inline-flex items-center rounded-full bg-accent-200 px-3 py-0.5 text-sm font-medium text-accent-900">
                {student.status}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-0.5 text-sm font-medium text-neutral-800">
                Inactive
              </span>
            )}
          </div>
        ),
      },
      {
        content: (
          <div className="flex gap-2 text-xl text-base-300">
            <div
              onClick={() => handleEditModal(student)}
              className="cursor-pointer hover:text-primary tooltip tooltip-top"
              data-tip="Edit"
            >
              <RiPencilLine />
            </div>
            <div
              onClick={() => handleDeleteModal(student)}
              className="cursor-pointer hover:text-error tooltip tooltip-error tooltip-top"
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
            <div className="flex justify-end my-2">
              <Button
                size="small"
                intent="primary"
                onClick={() => setIsOpenAddModal(true)}
              >
                + Add Student
              </Button>
            </div>
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
              btnIntent="danger"
              title={`Delete ${currentStudent?.studentFirstName} ${currentStudent?.studentLastName}`}
              loadingLabel="Deleting..."
              description={
                <div>
                  <p>This will permanently delete this student</p>
                  <p className="mt-2 mb-3">
                    Are you sure you want to delete this student? All of the
                    data will be permanently removed. This action cannot be
                    undone.
                  </p>
                </div>
              }
            />

            {/* Add Student Modal */}
            <Modal
              isOpen={isOpenAddModal}
              setIsOpen={setIsOpenAddModal}
              closeButton="Cancel"
              title="Add Student"
              description={
                <AddStudent
                  teachers={teachers.data}
                  handleSubmit={handleAddStudentModal}
                  btnLabel="Adding Student..."
                  btnLoading={addStudent.isLoading}
                />
              }
            />
            {/* Edit Student Modal */}
            <Modal
              isOpen={isOpenEditModal}
              setIsOpen={setIsOpenEditModal}
              closeButton="Cancel"
              title={`Edit ${currentStudent?.studentFirstName} ${currentStudent?.studentLastName}`}
              description={
                <EditStudentForm
                  currentStudent={currentStudent}
                  teachers={teachers.data}
                  closeModal={() => setIsOpenEditModal(false)}
                />
              }
            />
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
