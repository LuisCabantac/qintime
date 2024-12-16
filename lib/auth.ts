import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import NextAuth, { Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getAdminByEmail } from "@/lib/data-service";

interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface ISession {
  id: string;
  user: IUser;
  expires: string;
}

const authConfig = {
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials: Partial<Record<string, unknown>>) {
        if (!credentials.email) return null;
        const email = credentials.email as string;
        const user = await getAdminByEmail(email);
        if (user && user.password === credentials.password) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User | AdapterUser }) {
      try {
        const existingUser = await getAdminByEmail((user as IUser).email);

        if (!existingUser) {
          return false;
        }
        return true;
      } catch {
        return false;
      }
    },
    async jwt({ token, user }: { token: JWT; user?: User | AdapterUser }) {
      if (user) token.email = (user as IUser).email;
      return token;
    },
    async session({ session }: { session: Session }) {
      const user = await getAdminByEmail((session as ISession).user.email);

      (session as ISession).user.id = user!.id;
      (session as ISession).user.name = user!.name;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
