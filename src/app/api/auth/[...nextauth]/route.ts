// import { authenticate } from "@/services/authService"
import NextAuth from "next-auth"
import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize (credentials, req) {
        return true;
        // if (credentials) {
        //   const res = await authenticate(credentials.email, credentials.password)
        //   if (res) {
        //     return { ...res.user, apiToken: res.token }
        //   } else {
        //     return null
        //   }
        // } else {
        //   return null
        // }
      }
    })
  ],
  session: { strategy: "jwt" }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }