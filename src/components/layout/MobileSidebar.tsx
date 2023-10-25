import { adminNavigation, teacherNavigation } from "@src/constants/navigation"
import { useSession } from "next-auth/react"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

const MobileSidebar: React.FC = () => {
  const { data: session } = useSession()

  const renderNavigationItems = (navigationItems: typeof adminNavigation) => {
    return navigationItems.map((item) => (
      <a
        key={item.name}
        href={item.href}
        className={classNames(
          item.current
            ? "bg-primary-800 text-white"
            : "text-primary-100 hover:bg-primary-600",
          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
        )}
      >
        <item.icon
          className="flex-shrink-0 w-6 h-6 mr-4 text-primary-300"
          aria-hidden="true"
        />
        {item.name}
      </a>
    ))
  }

  return (
    <div className="flex-1 h-0 mt-5 overflow-y-auto">
      <nav className="px-2 space-y-1">
        {session?.role === "admin" && renderNavigationItems(adminNavigation)}
        {session?.role === "teacher" &&
          renderNavigationItems(teacherNavigation)}
      </nav>
    </div>
  )
}

export default MobileSidebar
