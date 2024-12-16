import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/auth-actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home | QInTime",
};

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/signin");

  return (
    <div>
      <p>HOME</p>
      <form action={signOutAction}>
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}
