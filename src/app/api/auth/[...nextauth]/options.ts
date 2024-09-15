import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const options: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],

  callbacks: {
    // async signIn() {
    //   const allowed = false;
    //checking bits email and stuff
    //   if (allowed) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    redirect() {
      return "/";
    },
  },
};
