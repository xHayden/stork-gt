// import { authenticate } from "@/services/authService"
import NextAuth, { Session } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { createUser, getUserByEmail, getUserById } from "@/lib/utils";
import { DBUser } from "@/app/types";
import { JWT } from "next-auth/jwt";

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw new Error("Set Github OAuth in .env");
}

export const authOptions = {
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
      if (session?.user.email) {
        const dbUser: DBUser = await getUserByEmail("auth/session/getUser", session?.user.email);
        session.user = dbUser;
      }
      return session;
    },
    jwt: async ({ token, account, profile }: {token: JWT, account: any, profile?: any}) => {
      if (profile?.email.email || token?.email) {
        const dbUser: DBUser = await getUserByEmail("auth/session/getUser", profile?.email ?? token.email);
        token.admin = dbUser.admin;
        token._id = dbUser._id;
        token.dues = dbUser.dues;
        token.name = dbUser.name;
        token.purchases = dbUser.purchases;
        token.role = dbUser.role;
        token.slug = dbUser.slug;
      }
      return token;
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }