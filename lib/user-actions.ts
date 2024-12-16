"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  getAdminById,
  getAttendeeByName,
  getAttendeeByUserId,
} from "@/lib/data-service";

export async function addAttendees(formData: FormData) {
  const session = await auth();

  if (!session) return redirect("/signin");

  const isAdmin = await getAdminById(session.user?.id ?? "");
  if (!isAdmin)
    throw new Error("You do not have permission to access this action.");

  const name = formData.get("name") as string;
  const section = formData.get("section") as string;

  const existingAttendee = await getAttendeeByName(name);
  if (existingAttendee?.name === name && existingAttendee?.section === section)
    throw new Error(
      `User with the name '${name}' and section '${section}' already exists.`,
    );

  const newAttendee = {
    name,
    section,
  };

  const { error } = await supabase.from("attendees").insert([newAttendee]);

  revalidatePath("/");

  if (error) throw new Error(error.message);
}

export async function deleteAttendee(userId: string) {
  const session = await auth();

  if (!session) return redirect("/signin");

  const isAdmin = await getAdminById(session.user?.id ?? "");
  if (!isAdmin)
    throw new Error("You do not have permission to access this action.");

  const existingAttendee = await getAttendeeByUserId(userId);
  if (!existingAttendee) throw new Error("This user does not exist.");
}
