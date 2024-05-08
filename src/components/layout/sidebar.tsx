import {
  adminNavigation,
  adminNavigationExternal,
  teacherNavigation,
  teacherNavigationExternal,
} from "@src/constants/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { TbExternalLink } from "react-icons/tb"
import Divider from "../ui/Divider"
import { FC } from "react"
import LoadingSkeleton from "../ui/loadingSkeleton"

interface NavItemProps {
  item: {
    name: string
    href: string
    icon: any
  }
  isExternal?: boolean
  active: boolean
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

const NavItem: FC<NavItemProps> = ({ item, isExternal = false, active }) => {
  const baseClasses = classNames(
    active
      ? "bg-primary-600 text-primary-50"
      : "text-primary-600 hover:bg-neutral-100 hover:text-primary-700",
    "group flex items-center px-2 py-2 text-md rounded-full cursor-pointer"
  )

  const content = (
    <div className={baseClasses}>
      <item.icon className="mr-3 text-2xl" aria-hidden="true" />
      {isExternal ? (
        <div className="flex items-center gap-2">
          {item.name}
          <span className="opacity-50">
            <TbExternalLink />
          </span>
        </div>
      ) : (
        <div className="font-bold ">{item.name}</div>
      )}
    </div>
  )

  return isExternal ? (
    <a
      key={item.name}
      href={item.href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {content}
    </a>
  ) : (
    <Link key={item.name} href={item.href} legacyBehavior>
      {content}
    </Link>
  )
}

interface NavigationSectionProps {
  items: NavItemProps["item"][]
  isExternal?: boolean
  router: any
  status: string
}

const NavigationSection: FC<NavigationSectionProps> = ({
  items,
  isExternal = false,
  router,
  status,
}) => {
  return (
    <div>
      {items.map((item) => (
        <NavItem
          key={item.name}
          item={item}
          isExternal={isExternal}
          active={router.pathname.includes(item.href)}
        />
      ))}
    </div>
  )
}

const ExternalToolsDivider = () => (
  <div className="mb-4">
    <Divider label="External Tools" />
  </div>
)

const Sidebar: FC = () => {
  const router = useRouter()
  const { data: session, status } = useSession()

  if (status == "loading") return <LoadingSkeleton />
  console.log("session: ", session)

  return (
    <div
      className={`flex flex-col ml-8 bg-white shadow ${"height-at-top"} rounded-xl overflow-auto`}
    >
      <div className="flex flex-col flex-1 mt-5">
        <nav className="flex flex-col justify-between flex-1 px-2 pb-4 space-y-1">
          {session?.role === "admin" && (
            <>
              <NavigationSection
                items={adminNavigation}
                router={router}
                status={status}
              />
              <div>
                <ExternalToolsDivider />
                <NavigationSection
                  items={adminNavigationExternal}
                  router={router}
                  isExternal={true}
                  status={status}
                />
              </div>
            </>
          )}
          {session?.role === "teacher" && (
            <>
              <NavigationSection
                items={teacherNavigation}
                router={router}
                status={status}
              />

              <div>
                <ExternalToolsDivider />
                <NavigationSection
                  items={teacherNavigationExternal}
                  router={router}
                  isExternal={true}
                  status={status}
                />
              </div>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
