import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { signInAction } from "@/lib/auth-actions";

import Logo from "@/components/Logo";
import SignInForm from "@/components/SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function Page() {
  const session = await auth();

  if (session) return redirect("/");

  return (
    <section className="py-52 text-[#212529] md:py-44">
      <Logo size="w-14" />
      <form action={signInAction} className="mt-4 flex flex-col gap-2">
        <SignInForm />
      </form>
    </section>
  );
}
