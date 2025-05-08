import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const secret = process.env.AUTH_SECRET;
const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://tool.web.abc-elearning.org";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          redirect_uri: `${baseUrl}api/auth/callback/github`,
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // 4 hours in seconds
  },
  secret: secret,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
