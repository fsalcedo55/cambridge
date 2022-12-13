import PageHeading from "../../components/ui/pageHeading"
import { FaChild, FaChalkboardTeacher } from "react-icons/fa"
import { trpc } from "../../utils/trpc"
import { useSession } from "next-auth/react"
import { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSession(ctx)
  if (!session || session.role != "teacher") {
    return { redirect: { destination: "/", permanent: false } }
  }
  return {
    props: {
      sessionSSR: await getAuthSession(ctx),
    },
  }
}

export default function AdminDashboard() {
  const { data: session } = useSession()

  return (
    <div>
      <PageHeading pageTitle="Teacher Dashboard" />
    </div>
  )
}

AdminDashboard.auth = true
