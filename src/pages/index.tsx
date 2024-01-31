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
      <div className="flex flex-col items-center justify-center min-h-screen gap-8">
        <Image
          src="/Spanish-For-Us-Logo-1080p (2).png"
          alt="logo"
          width={391}
          height={117}
        />
        <Loading />
      </div>
    )
  }

  return (
    <>
      <div className="border">
        <Header />
      </div>
      <HomePage />
    </>
  )
}

IndexPage.auth = false

function HomePage() {
  return (
    <div className="relative min-h-screen bg-primary-500">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="px-6 pt-10 pb-24 sm:pb-32 lg:col-span-7 lg:pl-0 lg:pr-10 lg:pb-40 lg:pt-28 xl:col-span-6">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <h1 className="mt-24 text-4xl font-bold tracking-tight text-amber-400 sm:mt-10 sm:text-7xl">
              Interactive Online Spanish Classes for Kids
            </h1>
            <p className="mt-6 text-2xl leading-8 text-primary-50">
              Step into the vibrant world of Spanish with personalized online
              lessons led by experienced native-speaking teachers. <br />
              Explore, learn, and embrace the language!
            </p>
            <div className="flex items-center mt-10 gap-x-6">
              <a
                href="https://tally.so/r/mRMq4l"
                rel="noopener noreferrer"
                target="_blank"
                className="rounded-full bg-amber-400 px-3.5 py-2.5 font-extrabold text-primary-500 shadow-sm hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                Let's Begin With a Free Class
              </a>
              <a href="#" className="font-semibold leading-6 text-primary-50">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
          <img
            className="aspect-[3/2] w-full bg-neutral-50 object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
            src="https://images.unsplash.com/photo-1611623516688-c47bb8d43311?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
      </div>
    </div>
  )
}
