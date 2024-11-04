import { PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return await getUniqueStudent(req, res)
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false })
  }
}

async function getUniqueStudent(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  try {
    const uniqueStudent = await prisma.student.findUnique({
      where: { id: String(id) },
    })
    return res.status(200).json({ success: true, uniqueStudent })
  } catch (error) {
    return res.status(500).json({ error: "Error fetching unique student" })
  }
}
