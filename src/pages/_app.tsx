import { SessionProvider, useSession } from "next-auth/react"
import "../styles/globals.css"
import type { AppProps, AppType } from "next/app"
import NextNProgress from "nextjs-progressbar"
import type { Session } from "next-auth"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import Layout from "../components/layout/layout"
import { trpc } from "../utils/trpc"
import type { NextComponentType } from "next"

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.

//Add custom appProp type then use union to add it
type CustomAppProps = AppProps & {
  Component: NextComponentType & { auth?: boolean } // add auth type
}

const MyApp: AppType<{ session: Session }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) => {
  return (
    <SessionProvider session={session}>
      <NextNProgress height={7} />
      {Component.auth ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
