import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/auth-actions";
import { getAllAdminsByAdminId } from "@/lib/data-service";

import Logo from "@/components/Logo";
import AdminsSection from "@/components/AdminsSection";

export const metadata: Metadata = {
  title: "Admins",
};

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/signin");

  async function getAllAdmins(adminId: string) {
    "use server";

    const attendees = await getAllAdminsByAdminId(adminId);
    return attendees;
  }

  return (
    <section>
      <nav className="grid gap-2 border-b border-[#e9ecef] px-4 py-4 md:px-2 md:py-2">
        <div className="flex items-center justify-between">
          <Logo size="w-8" />
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-md bg-[#dee2e6] px-4 py-2 font-medium hover:bg-[#ced4da]"
            >
              Sign out
            </button>
          </form>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="text-[#343a40]">
            Attendees
          </Link>
          <Link href="/admins" className="font-bold">
            Admins
          </Link>
        </div>
      </nav>
      <AdminsSection onGetAllAdmins={getAllAdmins} session={session} />
    </section>
  );
}
