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
  IAttendee,
} from "@/lib/data-service";

function normalizeString(str: string): string {
  return str.trim().toLowerCase();
}

function compareUser(
  storedUser: IAttendee | null,
  inputUser: { name: string; section: string },
): boolean {
  if (!storedUser) return false;

  return (
    normalizeString(storedUser.name) === normalizeString(inputUser.name) &&
    normalizeString(storedUser.section) === normalizeString(inputUser.section)
  );
}

export async function addAttendee(formData: FormData) {
  const session = await auth();

  if (!session) return redirect("/signin");

  const isAdmin = await getAdminById(session.user?.id ?? "");
  if (!isAdmin)
    throw new Error("You do not have permission to access this action.");

  const name = formData.get("name") as string;
  const section = formData.get("section") as string;

  const existingAttendee = await getAttendeeByName(name);

  if (compareUser(existingAttendee, { name, section }))
    throw new Error(
      `User with the name '${name}' and section '${section}' already exists.`,
    );

  const newAttendee = {
    name: name.split(" ").join(" "),
    section: section.split(" ").join(" ").toUpperCase(),
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

export async function verifyAttendee(attendeeId: string) {
  const session = await auth();

  if (!session) return redirect("/signin");

  const isAdmin = await getAdminById(session.user?.id ?? "");
  if (!isAdmin)
    return {
      success: false,
      message: "You do not have permission to access this action.",
    };

  const attendee = await getAttendeeByUserId(attendeeId);
  if (!attendee)
    return {
      success: false,
      message: "Invalid QR Code. User not found in the attendee list.",
    };

  if (!attendee.inTime && !attendee.outTime) {
    const updatedAttendee = {
      name: attendee.name,
      section: attendee.section,
      inTime: new Date(),
      outTime: attendee.outTime,
    };

    const { error } = await supabase
      .from("attendees")
      .update([updatedAttendee])
      .eq("id", attendeeId);

    if (error)
      return {
        success: false,
        message: "Error during check-in. Please try again.",
      };

    return {
      success: true,
      message: "Successfully checked in!",
    };
  }

  if (attendee.inTime && !attendee.outTime) {
    const updatedAttendee = {
      name: attendee.name,
      section: attendee.section,
      inTime: attendee.inTime,
      outTime: new Date(),
    };

    const { error } = await supabase
      .from("attendees")
      .update([updatedAttendee])
      .eq("id", attendeeId);

    if (error)
      return {
        success: false,
        message: "Error during check-out. Please try again.",
      };

    return {
      success: true,
      message: "Successfully checked out!",
    };
  }

  return {
    success: true,
    message: "You are all set.",
  };
}
