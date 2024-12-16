"use server";

import { signIn, signOut } from "@/lib/auth";
import { getAdminByEmail } from "@/lib/data-service";

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await getAdminByEmail(email);

  if (!user) return;

  if (user.password !== password) return;

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });
  return;
}

export async function signOutAction() {
  await signOut({ redirectTo: "/signin" });
}
