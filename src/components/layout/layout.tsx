import Header from "./header"
import Footer from "./footer"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Sidebar from "./sidebar"

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
    <div className="relative">
      <header className="fixed top-0 z-50">
        <Header />
      </header>

      <div className="w-screen drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="flex flex-col items-center justify-center drawer-content">
          <div className="flex flex-col min-w-full min-h-screen">
            <main className="flex-1 pt-4 pb-8 mt-16 mr-20 ml-[26rem]">
              {children}
            </main>
            <div className="z-50 w-screen mt-4">
              <Footer />
            </div>
          </div>
        </div>
        {/* sidebar */}
        <div className="fixed z-10 ml-20 h-80 ">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
