import LoadingSkeleton from "@ui/loadingSkeleton"
import { BiChevronRight } from "react-icons/bi"
import { AiFillHome } from "react-icons/ai"

//TODO: BUILD REUSABLE BREADCRUMB COMPONENT

const pages = [
  { name: "Projects", href: "#", current: false },
  { name: "Project Nero", href: "#", current: true },
]

type Props = {
  loading?: boolean
}

export default function Breadcrumbs({ loading }: Props) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <a href="#" className="text-primary hover:text-primary-focus">
              <AiFillHome
                className="flex-shrink-0 w-5 h-5"
                aria-hidden="true"
              />
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>

        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <BiChevronRight
                className="flex-shrink-0 w-5 h-5 text-primary"
                aria-hidden="true"
              />
              <a
                href={page.href}
                className="ml-4 text-sm font-medium text-primary hover:text-primary-focus hover:underline underline-offset-4"
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
