import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import type { PerfilUsuario } from "@prisma/client";

const credentialsSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const { email, senha } = parsed.data;
        const usuario = await prisma.usuario.findUnique({
          where: { email: email.toLowerCase().trim() },
        });

        if (!usuario || !usuario.ativo) return null;

        const ok = await bcrypt.compare(senha, usuario.senhaHash);
        if (!ok) return null;

        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil,
          oab: usuario.oab ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.perfil = (user as { perfil: PerfilUsuario }).perfil;
        token.oab = (user as { oab: string | null }).oab ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.perfil = token.perfil as PerfilUsuario;
        session.user.oab = (token.oab as string | null) ?? null;
      }
      return session;
    },
  },
});

export type AppSession = DefaultSession & {
  user: {
    id: string;
    perfil: PerfilUsuario;
    oab: string | null;
  } & DefaultSession["user"];
};
