import React from "react"
import LoadingSkeleton from "@ui/loadingSkeleton"

type Props = {
  pageTitle: string | React.ReactNode
  loading?: boolean
  userCard?: boolean
  content?: React.ReactNode
}

export default function PageHeading({
  pageTitle,
  loading,
  userCard,
  content,
}: Props) {
  return (
    <>
      {loading ? (
        //todo: build loading skeleton correctly and implement it where necessary. make sure it's the same height as the title.
        <h2 className="mb-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight">
          <LoadingSkeleton />
        </h2>
      ) : (
        <div>
          {userCard ? (
            <div className="mb-2 text-xl text-neutral-900">
              <div className="font-bold leading-7 sm:truncate sm:text-2xl sm:tracking-tight">
                {pageTitle}
              </div>
              <div className="p-1 mt-2 border rounded-full max-w-fit">
                {content}
              </div>
            </div>
          ) : (
            <div className="mb-4 text-2xl font-bold leading-7 text-neutral-900 sm:truncate sm:text-2xl sm:tracking-tight">
              {pageTitle}
            </div>
          )}
        </div>
      )}
    </>
  )
}
