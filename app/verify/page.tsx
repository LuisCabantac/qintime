import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import VerifySection from "@/components/VerifySection";
import { getAdminById } from "@/lib/data-service";

export const metadata: Metadata = {
  title: "Verify",
};

export default async function Page() {
  const session = await auth();

  if (!session) return redirect("/signin");

  const isAdmin = await getAdminById(session?.user?.id ?? "");
  if (!isAdmin) return redirect("/signin");

  return <VerifySection />;
}
