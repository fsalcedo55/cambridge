import { useSession } from "next-auth/react"
import PageHeading from "../../components/ui/pageHeading"
import { useState } from "react"
import Loading from "../../components/ui/loading"
import Modal from "../../components/ui/modal"
import EditUserForm from "../../components/editStudentForm"
import { useRouter } from "next/router"
import Image from "next/image"
import AccessDenied from "../../components/access-denied"
import { useQuery } from "@tanstack/react-query"
import { getAllUsers } from "../../services/user.services"
import Table from "../../components/ui/table"

interface User {
  id: string
  name: string
  email: string
  emailVerified: null
  image: string
  role: string
}

const userTableHeaders = [
  { id: "header1", label: "" },
  { id: "header2", label: "Name" },
  { id: "header3", label: "Email" },
  { id: "header4", label: "Role" },
]

export default function Users() {
  const { data: users, isLoading } = useQuery(["users"], getAllUsers)

  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  if (session?.role != "admin") {
    return <AccessDenied />
  }

  //Formatted rows for table cells
  const formattedRows = users?.map((user: User, idx: number) => ({
    cells: [
      { content: idx + 1 },
      {
        content: (
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="w-6 rounded-full">
                <Image
                  src={user.image}
                  width={24}
                  height={24}
                  alt={"teacher"}
                />
              </div>
            </div>
            <div>
              <div>{user.name}</div>
            </div>
          </div>
        ),
      },
      { content: user.email },
      { content: user.role },
    ],
  }))

  return (
    <div>
      <PageHeading pageTitle="Users" />
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <Table headers={userTableHeaders} rows={formattedRows} />
        </div>
      )}
    </div>
  )
}

Users.auth = true
