import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";
import type { PerfilUsuario } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      perfil: PerfilUsuario;
      oab: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    perfil: PerfilUsuario;
    oab: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    perfil: PerfilUsuario;
    oab: string | null;
  }
}
