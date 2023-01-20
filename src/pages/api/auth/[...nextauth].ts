import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../../lib/prismadb"
import { Knock } from "@knocklabs/node"
const knock = new Knock(process.env.KNOCK_API_KEY)
// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken"

const currentTime = Math.floor(Date.now() / 1000);

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  theme: {
    colorScheme: "light",
    logo: "/Spanish-For-Us-Logo-1080p (2).png", // Absolute URL to image
    brandColor: "#0175BC",
    buttonText: "#0175BC",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.knockToken = "randomstring"
      }
      return token
    },
    async signIn({ user, account, profile, email, credentials }) {
      await knock.users.identify(user.email!, {
        name: user.name!,
        email: user.email!,
      })
      
      return true
    },
    async session({ session, token, user }) {
  // console.log('jwtkey: ', process.env.KNOCK_SIGNING_KEY),

      // session.knockToken({
      //   knockToken: jwt.sign(
      //     {
      //       // The user that you're signing the token for
      //       sub: user.email,
      //       // When the token was issued
      //       iat: currentTime,
      //       // Expiry timestamp
      //       exp: currentTime + 60 * 60, // 1 hour from now
      //     },
      //     process.env.KNOCK_SIGNING_KEY!,
      //     {
      //       algorithm: "RS256",
      //     },
      //   )
      // })
      
      if (user.email == process.env.ADMIN_EMAILS) {
        session.role = "admin"
      } else {
        session.role = "teacher"
      }
      // session.accessToken = token.accessToken
      return session
    },
  },
}

export default NextAuth(authOptions)
