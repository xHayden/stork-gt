// import { authenticate } from "@/services/authService"
import NextAuth, { Session } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { createUser, getUserByEmail } from "@/lib/utils";
import { DBUser } from "@/app/types";

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw new Error("Set Github OAuth in .env");
}

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ account, profile }: any) {
      if (account && account.provider === "github" && profile.email && profile.name) {
        createUser("auth/signIn/createUser", profile.name, profile.email);
        return true;
      }
      return true;
    },
    session: async ({ session, token }: { session: Session, token: any }) => {
      console.log(session, token)
      if (session?.user) {
        const dbUser: DBUser = await getUserByEmail("auth/session/getUser", session?.user.email);
        session.user = dbUser;
      }
      return session;
    },
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }