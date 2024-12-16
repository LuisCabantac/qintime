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
      <Logo />
      <form action={signInAction} className="mt-4 flex flex-col gap-2">
        <SignInForm />
        {/* <div className="grid gap-1">
          <label className="text-sm font-medium">Email:</label>
          <input
            type="email"
            name="email"
            required
            className="rounded-lg border border-[#868e96] bg-transparent px-4 py-2"
            placeholder="Enter your email..."
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Password:</label>
          <input
            type="password"
            name="password"
            required
            className="rounded-lg border border-[#868e96] bg-transparent px-4 py-2"
            placeholder="Enter your password..."
          />
        </div>
        <button
          type="submit"
          className="mt-2 rounded-lg bg-[#212529] px-4 py-2 font-medium text-[#f8f9fa]"
        >
          Sign in
        </button> */}
      </form>
    </section>
  );
}
