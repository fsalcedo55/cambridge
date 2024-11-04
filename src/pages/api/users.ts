import { PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return await getAllUsers(req, res)
  } else if (req.method === "PUT") {
    return await updateUser(req, res)
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false })
  }
}

async function getAllUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allUsers = await prisma.user.findMany()
    return res.status(200).json({ success: true, allUsers })
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error fetching users from database.", success: false })
  }
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body
  try {
    const updatedEntry = await prisma.user.update({
      where: { id: body.user.id },
      data: { role: body.role },
    })
    return res.status(200).json({ success: true, ...updatedEntry })
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error updating user", success: false })
  }
}
