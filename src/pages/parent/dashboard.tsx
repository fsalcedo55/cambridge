import PageHeading from "@src/components/ui/pageHeading"
import { getAuthSession } from "@src/server/common/get-server-session"
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { GetServerSidePropsContext } from "next"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSession(ctx)
  if (!session || session.role !== "parent") {
    return { redirect: { destination: "/", permanent: false } }
  }
  return {
    props: {
      sessionSSR: session,
    },
  }
}

export default function ParentDashboard() {
  return (
    <div>
      <PageHeading pageTitle="Parent Dashboard" />
    </div>
  )
}

ParentDashboard.auth = true
