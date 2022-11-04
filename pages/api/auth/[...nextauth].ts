import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prismadb"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    // async jwt({ token }) {
    //   token.userRole = "admin"
    //   return token
    // },
    async session({ session, token, user }) {
      if (user.email == process.env.ADMIN_EMAILS) {
        session.role = "admin"
      } else {
        session.role = "teacher"
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
