import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Loading from "../components/ui/loading"
import Image from "next/image"
import { GetServerSidePropsContext } from "next"
import { getAuthSession } from "@src/server/common/get-server-session"
import HomeLandingPage from "@src/components/landingpage/HomeLandingPage"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "@heroicons/react/24/outline"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSession(ctx)

  if (session?.role === "teacher") {
    return {
      redirect: { destination: "/teacher/students", permanent: false },
    }
  }
  if (session?.role === "admin") {
    return { redirect: { destination: "/admin/dashboard", permanent: false } }
  }
  if (session?.role === "parent") {
    return { redirect: { destination: "/parent/dashboard", permanent: false } }
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
      <motion.nav
        className="sticky top-0 z-10 bg-white shadow-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="container px-4 mx-auto"
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between h-16">
            <Link href="/" legacyBehavior>
              <motion.a
                className="transition-transform duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/Spanish-For-Us-Logo-1080p (2).png"
                  alt="Spanish For Us Logo"
                  width={118}
                  height={36}
                  className="animate-fadeIn"
                />
              </motion.a>
            </Link>
            <div>
              <a
                href="https://tally.so/r/mRMq4l"
                rel="noopener noreferrer"
                target="_blank"
                className="flex px-5 py-2 font-bold rounded-full shadow-lg text-md bg-amber-400 text-primary-500 hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                Get Started <ArrowRightIcon className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.nav>
      <HomePage />
    </>
  )
}

IndexPage.auth = false

function HomePage() {
  return <HomeLandingPage />
}
