import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { nextCookies } from "better-auth/next-js";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), nextCookies()],
});
