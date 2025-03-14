// import PageHeading from "@src/components/ui/pageHeading"
import { getAuthSession } from "@src/server/common/get-server-session"
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { GetServerSidePropsContext } from "next"
import ParentOnboarding, {
  type onboardingSchema,
} from "@src/components/ParentOnboarding"
import { useState, useEffect } from "react"
import type { z } from "zod"

type OnboardingFormValues = z.infer<typeof onboardingSchema>

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSession(ctx)
  if (!session || session.role !== "parent") {
    return { redirect: { destination: "/", permanent: false } }
  }
  return {
    props: {
      sessionSSR: session,
    },
  }
}

export default function ParentDashboard() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  // Update the component's auth and onboarding properties when state changes
  useEffect(() => {
    if (hasCompletedOnboarding) {
      ParentDashboard.auth = true
      ParentDashboard.onboarding = false
    } else {
      ParentDashboard.auth = true
      ParentDashboard.onboarding = true
    }
  }, [hasCompletedOnboarding])

  const handleOnboardingComplete = async (values: OnboardingFormValues) => {
    console.log(values)
    setHasCompletedOnboarding(true)
  }

  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen">
        <ParentOnboarding onComplete={handleOnboardingComplete} />
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to your dashboard!</h1>
      {/* Rest of your dashboard content */}
    </div>
  )
}

// Initial properties
ParentDashboard.auth = true
ParentDashboard.onboarding = true
