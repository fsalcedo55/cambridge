import { httpBatchLink, loggerLink } from "@trpc/client"
import { createTRPCNext } from "@trpc/next"
import type { AppRouter } from "../server/routers/_app"
import SuperJSON from "superjson"

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return ""
  }

  return "http://localhost:3000"
}

export const trpc = createTRPCNext<AppRouter>({
  unstable_overrides: {
    useMutation: {
      /**
       * This function is called whenever a `.useMutation` succeeds
       **/
      async onSuccess(opts) {
        /**
         * @note that order here matters:
         * The order here allows route changes in `onSuccess` without
         * having a flash of content change whilst redirecting.
         **/
        // Calls the `onSuccess` defined in the `useQuery()`-options:
        await opts.originalFn()
        // Invalidate all queries in the react-query cache:
        await opts.queryClient.invalidateQueries()
      },
    },
  },
  config({ ctx }) {
    return {
      transformer: SuperJSON,
      links: [
        loggerLink(),
        httpBatchLink({
          url: getBaseUrl() + "/api/trpc",
        }),
      ],
    }
  },
})
