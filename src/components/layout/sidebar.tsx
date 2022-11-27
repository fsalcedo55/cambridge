import Link from "next/link"
import Loading from "../ui/loading"
import { useSession } from "next-auth/react"
import { AiFillHome } from "react-icons/ai"
import { useRouter } from "next/router"
import { HiUsers } from "react-icons/hi"
import { FaChild } from "react-icons/fa"

export default function Sidebar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const loading = status === "loading"

  return (
    <div>
      <div className="fixed flex-none p-4 h-96 top-16 drawer-side">
        {/* <label htmlFor="my-drawer-2" className="drawer-overlay"></label> */}
        <ul className="w-64 h-64 p-4 bg-primary/10 rounded-xl menu text-base-content">
          {!session && loading && <Loading />}
          {session?.role == "admin" ? (
            <div className="font-bold text-md">
              <li>
                <Link href="/admin/dashboard">
                  {router.pathname === "/admin/dashboard" ? (
                    <a className="active bg-primary/10 text-primary-content">
                      <span>
                        <AiFillHome />
                      </span>
                      <span>Admin Dashboard</span>
                    </a>
                  ) : (
                    <a className="hover:bg-primary/25">
                      <span>
                        <AiFillHome />
                      </span>
                      <span>Admin Dashboard</span>
                    </a>
                  )}
                </Link>
              </li>
              <li>
                <Link href="/admin/users">
                  {router.pathname === "/admin/users" ? (
                    <a className="active bg-primary/10 text-primary-content">
                      <span>
                        <HiUsers />
                      </span>
                      <span>Users</span>
                    </a>
                  ) : (
                    <a className="hover:bg-primary/25">
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
                    <a className="active bg-primary/10 text-primary-content">
                      <span>
                        <FaChild />
                      </span>
                      <span>Students</span>
                    </a>
                  ) : (
                    <a className="hover:bg-primary/25">
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
            <div className="font-bold text-md">
              <li>
                <Link href="/teacher/dashboard">
                  {router.pathname.includes("/teacher/dashboard") ? (
                    <a className="active bg-primary/10 text-primary-content">
                      <span>
                        <AiFillHome />
                      </span>
                      <span>Teacher Dashboard</span>
                    </a>
                  ) : (
                    <a className="hover:bg-primary/25">
                      <span>
                        <AiFillHome />
                      </span>
                      <span>Teacher Dashboard</span>
                    </a>
                  )}
                </Link>
              </li>
              <li>
                <Link href="/teacher/students">
                  {router.pathname.includes("/teacher/students") ? (
                    <a className="active bg-primary/10 text-primary-content">
                      <span>
                        <FaChild />
                      </span>
                      <span>Students</span>
                    </a>
                  ) : (
                    <a className="hover:bg-primary/25">
                      <span>
                        <FaChild />
                      </span>
                      <span>Students</span>
                    </a>
                  )}
                </Link>
              </li>
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}
