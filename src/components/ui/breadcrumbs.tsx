import LoadingSkeleton from "@ui/loadingSkeleton"
import { BiChevronRight } from "react-icons/bi"
import { AiFillHome } from "react-icons/ai"
import Link from "next/link"

// Pages array example
// const pages = [
//   { name: "Projects", href: "#", current: false },
//   { name: "Project Nero", href: "#", current: true }, <-- current page as true
// ]

type Page = {
  name: string
  href?: string
  current: boolean
}[]

type Props = {
  loading?: boolean
  pages: Page
}

export default function Breadcrumbs({ loading, pages }: Props) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center">
        {pages.map((page: any, idx: number) => (
          <li key={idx}>
            <div className="flex items-center">
              {loading ? (
                <LoadingSkeleton />
              ) : page.href ? (
                <Link
                  // as="div"
                  href={page?.href}
                  aria-current={page.current ? "page" : undefined}
                  legacyBehavior>
                  <div className="text-sm font-bold cursor-pointer text-neutral-500 hover:text-primary-500 hover:underline underline-offset-4">
                    {page.name}
                  </div>
                </Link>
              ) : (
                <div
                  className="text-sm font-bold cursor-default text-neutral-500"
                  aria-current={page.current ? "page" : undefined}
                >
                  {page.name}
                </div>
              )}
              {pages.length - 1 != idx && (
                <BiChevronRight
                  className="flex-shrink-0 w-5 h-5 mx-2 text-neutral-500"
                  aria-hidden="true"
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
