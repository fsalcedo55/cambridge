import { httpBatchLink, loggerLink } from "@trpc/client"
import { createTRPCNext } from "@trpc/next"
import type { AppRouter } from "../server/routers/_app"

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return ""
  }

  return "http://localhost:3000"
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        loggerLink(),
        httpBatchLink({
          url: getBaseUrl() + "/api/trpc",
        }),
      ],
    }
  },
})
