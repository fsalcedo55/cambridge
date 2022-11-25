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

      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="flex flex-col items-center justify-center drawer-content">
          <div className="flex flex-col min-w-full min-h-screen">
            <main className="flex-1 pt-4 pb-8 pr-16 mt-16 ml-80">
              {children}
            </main>
            <label
              htmlFor="my-drawer-2"
              className="btn btn-primary drawer-button lg:hidden"
            >
              Open sidebar
            </label>
            <div className="mt-4">
              <Footer />
            </div>
          </div>
        </div>
        {/* sidebar */}
        <Sidebar />
      </div>
    </div>
  )
}
