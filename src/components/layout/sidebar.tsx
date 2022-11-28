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

  const adminMenu = [
    { icon: <AiFillHome />, name: "Admin Dashboard", href: "/admin/dashboard" },
    { icon: <HiUsers />, name: "Users", href: "/admin/users" },
    { icon: <FaChild />, name: "Students", href: "/admin/students" },
  ]

  const teacherMenu = [
    {
      icon: <AiFillHome />,
      name: "Teacher Dashboard",
      href: "/teacher/dashboard",
    },
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
            <a className="active bg-neutral-200 text-primary-content">
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </a>
          ) : (
            <a className="hover:bg-neutral-300">
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
        <ul className="w-64 h-64 p-4 bg-neutral-100 rounded-xl menu text-neutral-900">
          {!session && loading && <Loading />}
          <div className="font-bold text-md">
            {session?.role == "admin" ? (
              <>{menuMap(adminMenu)}</>
            ) : (
              <>{menuMap(teacherMenu)}</>
            )}
          </div>
        </ul>
      </div>
    </div>
  )
}
