import Breadcrumbs from "@ui/breadcrumbs"
import PageHeading from "./pageHeading"

interface Page {
  name: string
  href?: string
  current: boolean
}

type Props = {
  pageTitle: string | React.ReactNode
  loading?: boolean
  userCard?: boolean
  content?: React.ReactNode
  pages: Page[]
}

export default function PageHeadingWithBreadcrumb({
  pageTitle,
  loading,
  userCard,
  content,
  pages,
}: Props) {
  return (
    <>
      <div className="flex flex-col">
        <Breadcrumbs pages={pages} loading={loading} />
        <div className="h-2"></div>
        <PageHeading
          pageTitle={pageTitle}
          loading={loading}
          userCard={userCard}
          content={content}
        />
      </div>
    </>
  )
}
