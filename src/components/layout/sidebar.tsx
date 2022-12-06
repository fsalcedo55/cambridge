import Link from "next/link"
import { useSession } from "next-auth/react"
import { AiFillHome } from "react-icons/ai"
import { useRouter } from "next/router"
import { HiUsers } from "react-icons/hi"
import { FaChild } from "react-icons/fa"
import LoadingSkeleton from "../ui/loadingSkeleton"

export default function Sidebar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const loading = status === "loading"

  const adminMenu = [
    { icon: <AiFillHome />, name: "Admin Dashboard", href: "/admin/dashboard" },
    { icon: <HiUsers />, name: "Users", href: "/admin/users" },
    { icon: <FaChild />, name: "Students", href: "/admin/students" },
  ]

  const teacherMenu = [
    // {
    //   icon: <AiFillHome />,
    //   name: "Teacher Dashboard",
    //   href: "/teacher/dashboard",
    // },
    { icon: <FaChild />, name: "Students", href: "/teacher/students" },
  ]

  type Menu = {
    icon: JSX.Element
    name: string
    href: string
  }[]

  const menuMap = (arr: Menu) => {
    return arr.map((item: any, idx: number) => (
      <li key={idx}>
        <Link href={item.href}>
          {router.pathname.includes(item.href) ? (
            <a className="active bg-primary-100 text-primary-900 hover:bg-primary-200">
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </a>
          ) : (
            <a className="hover:bg-primary-200 text-primary-900">
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </a>
          )}
        </Link>
      </li>
    ))
  }

  return (
    <div>
      <div className="fixed flex-none p-4 h-96 top-16 drawer-side">
        <ul className="w-64 h-64 p-4 bg-white shadow rounded-xl menu text-primary-800">
          {!session && loading ? (
            <div className="flex flex-col gap-4">
              <LoadingSkeleton />
              <LoadingSkeleton />
            </div>
          ) : (
            <div className="font-bold text-md">
              {session?.role == "admin" ? (
                <>{menuMap(adminMenu)}</>
              ) : (
                <>{menuMap(teacherMenu)}</>
              )}
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}
