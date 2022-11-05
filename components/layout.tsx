import Header from "./header"
import Footer from "./footer"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Loading from "./loading"
import { HiUsers } from "react-icons/hi"
import { FaChild } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import { useEffect } from "react"

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const loading = status === "loading"

  console.log("aspath: ", router.asPath)

  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="flex flex-col items-center justify-center drawer-content">
          <div className="flex flex-col min-w-full min-h-screen">
            <Header />
            <main className="flex-1 px-16 pt-4 pb-8">{children}</main>
            <label
              htmlFor="my-drawer-2"
              className="btn btn-primary drawer-button lg:hidden"
            >
              Open sidebar
            </label>
            <Footer />
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="p-4 overflow-y-auto menu w-80 bg-primary text-base-100">
            {!session && loading && <Loading />}
            {session?.role == "admin" ? (
              <div className="text-lg font-semibold">
                <li>
                  <Link href="/admin/dashboard">
                    {router.pathname === "/admin/dashboard" ? (
                      <a className="active bg-primary-focus">
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
                      <a className="active bg-primary-focus">
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
                      <a className="active bg-primary-focus">
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
    </>
  )
}
