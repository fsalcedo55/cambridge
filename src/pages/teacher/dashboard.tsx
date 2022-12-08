import PageHeading from "../../components/ui/pageHeading"
import { FaChild, FaChalkboardTeacher } from "react-icons/fa"
import { trpc } from "../../utils/trpc"
import { useSession } from "next-auth/react"

export default function AdminDashboard() {
  const { data: session } = useSession()

  return (
    <div>
      <PageHeading pageTitle="Teacher Dashboard" />
    </div>
  )
}

AdminDashboard.auth = true
