import { SessionProvider } from "next-auth/react"
import "../styles/globals.css"
import type { AppProps, AppType } from "next/app"
import NextNProgress from "nextjs-progressbar"
import type { Session } from "next-auth"
// import type { Session } from "auth"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import Layout from "../components/layout/layout"
import { trpc } from "../utils/trpc"

const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     cacheTime: 1 * 60 * 60 * 1000,
  //     staleTime: 1 * 60 * 60 * 1000,
  //   },
  // },
})

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.

const MyApp: AppType<{ session: Session }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{
  session: Session
  // dehydratedState: unknown
}>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        {/* <Hydrate state={pageProps.dehydratedState}> */}
        <NextNProgress />
        {Component.auth ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
        {/* </Hydrate> */}
        <ReactQueryDevtools initialIsOpen={false} />
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default trpc.withTRPC(MyApp)
