import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/auth-actions";
import {
  getAllAttendeesByAdminId,
  getAllAttendeesByQuery,
} from "@/lib/data-service";

import Logo from "@/components/Logo";
import AttendeesSection from "@/components/AttendeesSection";

export const metadata: Metadata = {
  title: "Attendees | QInTime",
};

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/signin");

  async function getAllAttendees(adminId: string, query: string) {
    "use server";
    if (!query) {
      const attendees = await getAllAttendeesByAdminId(adminId);
      return attendees;
    }
    const attendees = await getAllAttendeesByQuery(query);
    return attendees;
  }

  return (
    <section>
      <nav className="grid gap-2 border-b border-[#e9ecef] px-4 pb-2 pt-4 md:px-2">
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
          <Link href="/" className="font-bold">
            Attendees
          </Link>
          <Link href="/admins" className="text-[#343a40]">
            Admins
          </Link>
        </div>
      </nav>
      <AttendeesSection onGetAllAttendees={getAllAttendees} session={session} />
    </section>
  );
}
