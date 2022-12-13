import { getAuthSession } from "@src/server/common/get-server-session"
import { GetServerSidePropsContext } from "next"

// interface Props {
//   userRole: "admin" | "teacher"
// }

export const protectPage = (userRole: string) => {
  const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getAuthSession(ctx)
    if (!session || session.role != userRole) {
      return { redirect: { destination: "/", permanent: false } }
    }
    return {
      props: {
        sessionSSR: await getAuthSession(ctx),
      },
    }
  }
}
