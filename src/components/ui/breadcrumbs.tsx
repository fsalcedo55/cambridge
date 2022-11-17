import LoadingSkeleton from "@ui/loadingSkeleton"

//TODO: BUILD REUSABLE BREADCRUMB COMPONENT

type Props = {
  pageTitle: any
  loading?: boolean
}

export default function PageHeading({ pageTitle, loading }: Props) {
  return (
    <>
      {loading ? (
        <h2 className="mb-6 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          <LoadingSkeleton />
        </h2>
      ) : (
        <div className="text-sm breadcrumbs">
          <ul>
            <li></li>
            <li>
              <LoadingSkeleton height="short" />
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
