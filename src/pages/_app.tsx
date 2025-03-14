import { SessionProvider } from "next-auth/react"
import "../styles/globals.css"
import type { AppProps, AppType } from "next/app"
import NextNProgress from "nextjs-progressbar"
import type { Session } from "next-auth"
import Layout from "../components/layout/layout"
import { trpc } from "../utils/trpc"
import type { NextComponentType } from "next"
import { Toaster } from "sonner"

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.

//Add custom appProp type then use union to add it
type CustomAppProps = AppProps & {
  Component: NextComponentType & { auth?: boolean; onboarding?: boolean } // add auth type
}

const MyApp: AppType<{ session: Session }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) => {
  return (
    <SessionProvider session={session}>
      <NextNProgress height={7} showOnShallow={false} />
      {Component.auth ? (
        Component.onboarding ? (
          // Onboarding layout - just the bare page without nav/sidebar
          <Component {...pageProps} />
        ) : (
          // Regular authenticated layout
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )
      ) : (
        // Non-authenticated pages
        <Component {...pageProps} />
      )}
      <Toaster />
    </SessionProvider>
  )

  // return (
  //   <SessionProvider session={session}>
  //     <NextNProgress height={7} showOnShallow={false} />

  //     {Component.auth ? (
  //       <Layout>
  //         <Component {...pageProps} />
  //       </Layout>
  //     ) : (
  //       <Component {...pageProps} />
  //     )}
  //     {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  //     <Toaster />
  //   </SessionProvider>
  // )
}

// function MylApp({ Component, pageProps }: CustomAppProps) {
//   // Check if the page is using auth
//   if (Component.auth) {
//     // If it's onboarding, use a different layout
//     if (Component.onboarding) {
//       return (
//         // Your onboarding layout here - maybe just the bare page without nav/sidebar
//         <Component {...pageProps} />
//       )
//     }

//     // Your regular authenticated layout
//     return (
//       <Layout>
//         <Component {...pageProps} />
//       </Layout>
//     )
//   }

//   // Non-authenticated pages
//   return <Component {...pageProps} />
// }

export default trpc.withTRPC(MyApp)
