import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/auth-actions";
import {
  getAllAttendiesByAdminId,
  getAllAttendiesByQuery,
} from "@/lib/data-service";

import Logo from "@/components/Logo";
import HomeSection from "@/components/HomeSection";

export const metadata: Metadata = {
  title: "Home | QInTime",
};

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/signin");

  async function getAllAttendies(adminId: string, query: string) {
    "use server";
    if (!query) {
      const attendies = await getAllAttendiesByAdminId(adminId);
      return attendies;
    }
    const attendies = await getAllAttendiesByQuery(query);
    return attendies;
  }

  return (
    <section>
      <nav className="flex items-center justify-between border-b border-[#e9ecef] px-4 py-4 md:py-2">
        <Logo size="w-8" />
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-md bg-[#dee2e6] px-4 py-2 font-medium hover:bg-[#ced4da]"
          >
            Sign out
          </button>
        </form>
      </nav>
      <HomeSection onGetAllAttendies={getAllAttendies} session={session} />
    </section>
  );
}
