import { useRouter } from "next/router"
import Breadcrumbs from "./ui/breadcrumbs"
import LoadingSkeleton from "./ui/loadingSkeleton"
import PageHeading from "./ui/pageHeading"
import Image from "next/image"

interface StudentPageHeaderProps {
  isLoading: boolean
  studentData: any
  pages: any
}

export default function StudentPageHeader({
  isLoading,
  studentData,
  pages,
}: StudentPageHeaderProps) {
  const router = useRouter()

  return (
    <div>
      <div>
        <Breadcrumbs pages={pages} loading={isLoading} />
      </div>

      {isLoading ? (
        <PageHeading pageTitle={<LoadingSkeleton />} />
      ) : (
        <div>
          <PageHeading
            userCard={true}
            pageTitle={`${studentData?.studentFirstName} ${studentData?.studentLastName}`}
            content={
              <div className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-6 rounded-full">
                    {studentData?.teacher?.image && router.isReady ? (
                      <Image
                        src={`${studentData?.teacher.image}`}
                        width={24}
                        height={24}
                        alt={"teacher"}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                {studentData?.teacher?.name ? (
                  <div className="text-sm">{studentData?.teacher.name}</div>
                ) : (
                  ""
                )}
              </div>
            }
          />
        </div>
      )}
    </div>
  )
}
