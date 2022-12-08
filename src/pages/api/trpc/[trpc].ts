import { appRouter } from "src/server/routers/_app"
import * as trpcNext from "@trpc/server/adapters/next"
import { createContext } from "@src/server/context"

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
})
