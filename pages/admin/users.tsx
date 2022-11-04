import { useSession } from "next-auth/react"
import Layout from "../../components/layout"
import PageHeading from "../../components/pageHeading"
import { useEffect, useState } from "react"
import Loading from "../../components/loading"
import Modal from "../../components/modal"
import EditUserForm from "../../components/editUserForm"
import { useRouter } from "next/router"
import Image from "next/image"
import AccessDenied from "../../components/access-denied"

export default function Users() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getAllUsers()
  }, [])

  const getAllUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "force-cache",
      })
      const data = await response.json()
      console.log(data)
      setUsers(data.allUsers)
      if (response.status != 200) {
        console.log("Error fetching users from the database")
      } else {
        console.log("Success fetching users")
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  console.log("users: ", users)

  if (session?.role != "admin") {
    return <AccessDenied />
  }

  return (
    <Layout>
      <PageHeading pageTitle="Users" />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-compact">
            {/* <!-- head --> */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* <!-- row --> */}
              {users?.map((user, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    {" "}
                    <td className="border-none">
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-12 h-12 mask mask-squircle">
                            {/* <img
                                src={user.image}
                                alt="Avatar Tailwind CSS Component"
                              /> */}
                            <Image
                              src={user.image}
                              width={48}
                              height={48}
                              alt={"teacher"}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.name}</div>
                        </div>
                      </div>
                    </td>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.role
                      ? user.role[0].toUpperCase() + user.role.slice(1)
                      : "None"}
                  </td>
                  <td>
                    <Modal
                      content={<EditUserForm user={user} />}
                      title="Edit User"
                      buttonTitle="Edit"
                      buttonStyle="btn btn-outline btn-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
