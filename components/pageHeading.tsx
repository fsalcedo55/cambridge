type Props = {
  pageTitle: string
}

export default function PageHeading({ pageTitle }: Props) {
  return (
    <>
      <h2 className="mb-6 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {pageTitle}
      </h2>
      {/* <div className="divider"></div> */}
    </>
  )
}
