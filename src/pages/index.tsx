import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Header from "../components/layout/header"
import Loading from "../components/ui/loading"
import Image from "next/image"
import { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSession(ctx)

  if (session?.role === "teacher") {
    return {
      redirect: { destination: "/teacher/students", permanent: false },
    }
  } else if (session?.role === "admin") {
    return { redirect: { destination: "/admin/dashboard", permanent: false } }
  }
  return {
    props: {
      sessionSSR: await getAuthSession(ctx),
    },
  }
}

export default function IndexPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="min-h-screen">
        <Loading />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center mb-6">
        <Image
          src="/Spanish-For-Us-Logo-1080p (2).png"
          alt="logo"
          width={391}
          height={117}
        />
      </div>
    </div>
  )
}

IndexPage.auth = false
