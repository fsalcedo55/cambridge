import { PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"
import { userAgent } from "next/server"

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return await getAllTeachers(req, res)
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false })
  }
}

async function getAllTeachers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allTeachers = await prisma.user.findMany({
      where: { role: "teacher" },
    })
    return res.status(200).json({ success: true, allTeachers })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: "Error fetching teachers from database", success: false })
  }
}
