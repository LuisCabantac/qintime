"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getAdminById, getAttendieByName } from "@/lib/data-service";

export async function addAttendies(formData: FormData) {
  const session = await auth();

  if (!session) return redirect("/signin");

  const isAdmin = await getAdminById(session.user?.id ?? "");
  if (!isAdmin)
    throw new Error("You do not have permission to access this action.");

  const name = formData.get("name") as string;
  const section = formData.get("section") as string;

  const existingAttendie = await getAttendieByName(name);
  if (existingAttendie?.name === name && existingAttendie?.section === section)
    throw new Error(
      `User with the name '${name}' and section '${section}' already exists.`,
    );

  const newAttendie = {
    name,
    section,
  };

  const { error } = await supabase.from("attendies").insert([newAttendie]);

  revalidatePath("/");

  if (error) throw new Error(error.message);
}
