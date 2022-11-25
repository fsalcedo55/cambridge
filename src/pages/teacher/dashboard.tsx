import PageHeading from "../../components/ui/pageHeading"
import { FaChild, FaChalkboardTeacher } from "react-icons/fa"
import { trpc } from "../../utils/trpc"

export default function AdminDashboard() {
  return (
    <div>
      <PageHeading pageTitle="Teacher Dashboard" />
    </div>
  )
}

AdminDashboard.auth = true
