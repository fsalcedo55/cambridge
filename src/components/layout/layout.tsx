import Header from "./header"
import Footer from "./footer"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Loading from "../ui/loading"
import { HiUsers } from "react-icons/hi"
import { FaChild } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"

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
        <div className="fixed flex-none p-4 h-96 top-16 drawer-side">
          {/* <label htmlFor="my-drawer-2" className="drawer-overlay"></label> */}
          <ul className="w-64 p-4 h-72 bg-base-200 rounded-xl menu text-primary-content">
            {!session && loading && <Loading />}
            {session?.role == "admin" ? (
              <div className="text-lg font-semibold">
                <li>
                  <Link href="/admin/dashboard">
                    {router.pathname === "/admin/dashboard" ? (
                      <a className="active bg-base-300 text-primary-content">
                        <span>
                          <AiFillHome />
                        </span>
                        <span>Dashboard</span>
                      </a>
                    ) : (
                      <a>
                        <span>
                          <AiFillHome />
                        </span>
                        <span>Dashboard</span>
                      </a>
                    )}
                  </Link>
                </li>
                <li>
                  <Link href="/admin/users">
                    {router.pathname === "/admin/users" ? (
                      <a className="active bg-base-300 text-primary-content">
                        <span>
                          <HiUsers />
                        </span>
                        <span>Users</span>
                      </a>
                    ) : (
                      <a>
                        <span>
                          <HiUsers />
                        </span>
                        <span>Users</span>
                      </a>
                    )}
                  </Link>
                </li>
                <li>
                  <Link href="/admin/students">
                    {router.pathname.includes("/admin/students") ? (
                      <a className="active bg-base-300 text-primary-content">
                        <span>
                          <FaChild />
                        </span>
                        <span>Students</span>
                      </a>
                    ) : (
                      <a>
                        <span>
                          <FaChild />
                        </span>
                        <span>Students</span>
                      </a>
                    )}
                  </Link>
                </li>
              </div>
            ) : (
              <div>
                <li>
                  <a>Sidebar Item 1</a>
                </li>
                <li>
                  <a>Sidebar Item 2</a>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
