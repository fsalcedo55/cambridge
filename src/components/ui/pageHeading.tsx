import LoadingSkeleton from "@ui/loadingSkeleton"

type Props = {
  pageTitle: any
  loading?: boolean
}

export default function PageHeading({ pageTitle, loading }: Props) {
  return (
    <>
      {loading ? (
        //todo: build loading skeleton correctly and implement it where necessary
        <h2 className="mb-6 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          <LoadingSkeleton />
        </h2>
      ) : (
        <h2 className="mb-6 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {pageTitle}
        </h2>
      )}
    </>
  )
}
