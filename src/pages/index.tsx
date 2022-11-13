import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Header from "../components/layout/header"
import Loading from "../components/ui/loading"
import Image from "next/image"

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
