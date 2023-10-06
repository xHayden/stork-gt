import NextAuth from "next-auth"
import { DBUser } from "."
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DBUser,
    expires: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Omit<DBUser & DefaultJWT, "typeName"> {}
}