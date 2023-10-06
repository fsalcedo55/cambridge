import { router, publicProcedure } from "../trpc"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// export const entitlementRouter = router({
//   byLessonId: publicProcedure
//     .input(
//       z.object({
//         lessonId: z.string(),
//       })
//     )
//     .query(({ input }) => {
//       return prisma.entitlements.findUnique({
//         where: ,
//       })
//     }),
// })
