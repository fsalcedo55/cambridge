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
import { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import { trpc } from "@src/utils/trpc"
import EditUser from "@src/components/admin/users/editUser"
import { IUser } from "@src/interfaces"
import { capFirstLetter } from "@src/helpers/string"

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

export interface User {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  role: string | null
}

const userTableHeaders = [
  { id: "header1", label: "" },
  { id: "header2", label: "Name" },
  { id: "header3", label: "Email" },
  { id: "header4", label: "Role" },
  { id: "header5", label: "Actions" },
]

export default function Users() {
  const usersTRPC = trpc.user.getAll.useQuery()
  // const { data: users, isLoading } = useQuery(["users"], getAllUsers)
  const { data: session } = useSession()
  const [currentUser, setCurrentUser] = useState<IUser>()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleEditModal = (user: IUser) => {
    setIsOpen(true)
    setCurrentUser(user)
  }

  // Formatted rows for table cells
  const formattedRows = usersTRPC.data?.map((user: IUser, idx: number) => ({
    cells: [
      { content: idx + 1 },
      {
        content: (
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="w-6 rounded-full">
                {user.image && (
                  <Image src={user.image} width={24} height={24} alt={"user"} />
                )}
              </div>
            </div>
            <div>
              <div>{user.name ?? ""}</div>
            </div>
          </div>
        ),
      },
      { content: user.email! },
      { content: user.role ? capFirstLetter(user.role) : "None" },
      {
        content: (
          <div>
            <a
              onClick={() => handleEditModal(user)}
              className="text-sm font-bold cursor-pointer text-neutral-500 hover:text-primary-500 hover:underline underline-offset-4"
            >
              Edit
            </a>
            <Modal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              closeButton="Cancel"
              title={`Edit ${currentUser?.name ?? ""}`}
              description={
                <EditUser
                  closeModal={() => setIsOpen(false)}
                  user={currentUser}
                />
              }
            />
          </div>
        ),
      },
    ],
  }))

  return (
    <div>
      <PageHeading pageTitle="Users" />
      {usersTRPC.isLoading ? (
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
