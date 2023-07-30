import NextAuth from "next-auth"
import { DBUser } from "."

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DBUser,
    expires: string
  }
}