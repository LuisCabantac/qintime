"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  getAdminByAdminId,
  getAdminByEmailId,
  getAdminById,
  getAttendeeByName,
  getAttendeeByUserId,
} from "@/lib/data-service";

export async function addAttendee(formData: FormData) {
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

export async function addAdmin(formData: FormData) {
  const session = await auth();

  if (!session) return redirect("/signin");

  const isAdmin = await getAdminById(session.user?.id ?? "");
  if (!isAdmin)
    throw new Error("You do not have permission to access this action.");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const existingEmail = await getAdminByEmailId(email);
  if (existingEmail) throw new Error("This email is already in use.");

  const newAdmin = {
    name,
    email,
    password,
  };

  const { error } = await supabase.from("admins").insert([newAdmin]);

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

  const { error } = await supabase.from("attendees").delete().eq("id", userId);

  if (error) throw new Error(error.message);
}

export async function deleteAdmin(adminId: string) {
  const session = await auth();

  if (!session) return redirect("/signin");

  const isAdmin = await getAdminById(session.user?.id ?? "");
  if (!isAdmin)
    throw new Error("You do not have permission to access this action.");

  const existingAdmin = await getAdminByAdminId(adminId);
  if (!existingAdmin) throw new Error("This user does not exist.");

  const { error } = await supabase.from("admins").delete().eq("id", adminId);

  if (error) throw new Error(error.message);
}
