import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const authOptions = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDb();

        // Check if user exists
        const currentUser = await User.findOne({ email: user.email });

        if (!currentUser) {
          // Create new user
          await User.create({
            email: user.email,
            username: user.email.split("@")[0],
            provider: account.provider, // keep track of which provider
          });
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },

    async session({ session }) {
      await connectDb();
      const dbUser = await User.findOne({ email: session.user.email });

      if (dbUser) {
        session.user.name = dbUser.username;
        session.user.id = dbUser._id.toString();
      }

      return session;
    },
  },
});

export { authOptions as GET, authOptions as POST };
