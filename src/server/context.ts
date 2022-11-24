import * as trpc from "@trpc/server"
import * as trpcNext from "@trpc/server/adapters/next"
import { getAuthSession } from "./common/get-server-session"
import { prisma } from "@prisma/client"
import client from "lib/prismadb"

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const req = opts?.req
  const res = opts?.res

  const session = req && res && (await getAuthSession({ req, res }))
  return { session, client }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
