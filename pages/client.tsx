import Layout from "../components/layout"
import { useSession } from "next-auth/react"

export default function ClientPage() {
  const { data: session } = useSession()

  if (session?.role === "admin") {
    return (
      <Layout>
        <h1>Welcome to the admin portal</h1>
      </Layout>
    )
  }

  return (
    <Layout>
      <h1>Welcome to teacher portal</h1>
    </Layout>
  )
}
