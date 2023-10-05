import PageHeading from "../../components/ui/pageHeading"
import { FaChild, FaChalkboardTeacher } from "react-icons/fa"
import { useSession } from "next-auth/react"
import { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"

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

export default function NewPage() {
  const { data: session } = useSession()

  return (
    <div>
      <PageHeading pageTitle="Admin Dashboard" />
      <div className="flex gap-4 text-center">
        <div className="w-48 text-center rounded-xl h-36 bg-info/75">
          <div className="flex justify-center p-4 text-4xl">
            <FaChild />
          </div>
          <h1 className="font-bold">Total Active Students</h1>
          <h2 className="text-4xl font-bold">39</h2>
        </div>
        <div className="w-48 rounded-xl h-36 bg-secondary/75">
          <div className="flex justify-center p-4 text-4xl">
            <FaChalkboardTeacher />
          </div>
          <h1 className="font-bold">Total Teachers</h1>
          <h2 className="text-4xl font-bold">5</h2>
        </div>
      </div>
    </div>
  )
}

NewPage.auth = true
