import { initTRPC } from "@trpc/server"
import * as trpcNext from "@trpc/server/adapters/next"
import { z } from "zod"

const t = initTRPC.create()

const appRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string().nullish() }))
    .query(({ input }) => {
      return {
        text: `hello ${input?.name ?? `world`}`,
      }
    }),
})

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
})
