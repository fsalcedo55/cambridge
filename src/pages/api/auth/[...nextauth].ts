import NextAuth, { NextAuthOptions, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../../lib/prismadb"
import EmailProvider from "next-auth/providers/email"
import { GetServerSidePropsContext } from "next"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST as string,
        port: process.env.EMAIL_SERVER_PORT as string,
        auth: {
          user: process.env.EMAIL_SERVER_USER as string,
          pass: process.env.EMAIL_SERVER_PASSWORD as string,
        },
      },
      from: process.env.EMAIL_FROM as string,
    }),
  ],
  theme: {
    colorScheme: "light",
    logo: "/Spanish-For-Us-Logo-1080p (2).png", // Absolute URL to image
    brandColor: "#0175BC",
    buttonText: "#FFFFFF",
  },
  callbacks: {
    async signIn({ user }) {
      // Ensure email is not null before proceeding
      if (!user.email) return false

      const isUser = await prisma.user.findUnique({
        where: { email: user.email },
      })

      if (isUser) {
        return true
      }

      if (user.email.includes("spanishforus")) {
        await prisma.user.create({
          data: {
            email: user?.email,
            name: user?.name,
            image: user?.image,
            role: "teacher",
          },
        })
      }

      if (user.email) {
        await prisma.user.create({
          data: {
            email: user?.email,
            name: user.name ?? null,
            image: user.image ?? null,
            role: "parent",
          },
        })
      }

      return true
    },
    async session({ session, user }) {
      const role = await prisma.user.findUnique({
        where: { email: user.email },
        select: { role: true },
      })

      if (user.email == process.env.ADMIN_EMAILS) {
        session.role = "admin"
      }

      if (role) {
        session.role = role.role
      } else {
        session.role = "teacher"
      }

      return session
    },
  },
}

export default NextAuth(authOptions)

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"]
  res: GetServerSidePropsContext["res"]
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
