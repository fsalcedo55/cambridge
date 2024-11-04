import PageHeading from "../../components/ui/pageHeading"
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSession(ctx)
  if (!session || session.role !== "teacher") {
    return { redirect: { destination: "/", permanent: false } }
  }
  return {
    props: {
      sessionSSR: await getAuthSession(ctx),
    },
  }
}

export default function TeacherDashboard() {
  return (
    <div>
      <PageHeading pageTitle="Teacher Dashboard" />
    </div>
  )
}

TeacherDashboard.auth = true
