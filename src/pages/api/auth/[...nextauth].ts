// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import NextAuth, { NextAuthOptions, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../../lib/prismadb"
import EmailProvider from "next-auth/providers/email"
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { GetServerSidePropsContext } from "next"

export const authOptions: NextAuthOptions = {
  debug: true,
  logger: {
    error: (code, metadata) => {
      console.error(code, metadata)
    },
    warn: (code) => {
      console.warn(code)
    },
    debug: (code, metadata) => {
      // eslint-disable-next-line no-console
      console.log(code, metadata)
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || "smtp.resend.com",
        port: Number(process.env.EMAIL_SERVER_PORT) || 465,
        auth: {
          user: process.env.EMAIL_SERVER_USER || "resend",
          pass: process.env.RESEND_API_KEY || process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || "noreply@spanishforuskids.com",
    }),
  ],
  theme: {
    colorScheme: "light",
    logo: "/Spanish-For-Us-Logo-1080p (2).png", // Absolute URL to image
    brandColor: "#0175BC",
    buttonText: "#FFFFFF",
  },
  // Removing custom pages to use default NextAuth pages
  // pages: {
  //   signIn: "/api/auth/signin",
  //   error: "/api/auth/error",
  // },
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

      if (user.email === process.env.ADMIN_EMAILS) {
        await prisma.user.create({
          data: {
            email: user?.email,
            name: user?.name,
            image: user?.image,
            role: "admin",
          },
        })
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

      if (user.email === process.env.ADMIN_EMAILS) {
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
