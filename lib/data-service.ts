import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export interface IAdmin {
  readonly id: string;
  name: string;
  email: string;
  readonly password: string;
}

export interface IAttendee {
  readonly id: string;
  readonly studentNumber: string;
  name: string;
  section: string;
  inTime: string;
  outTime: string;
}

export async function getAdminByEmail(email: string): Promise<IAdmin | null> {
  const { data } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .single();
  return data;
}

export async function getAdminById(adminId: string): Promise<IAdmin | null> {
  const { data } = await supabase
    .from("admins")
    .select("*")
    .eq("id", adminId)
    .single();
  return data;
}

export async function getAllAttendeesByAdminId(
  adminId: string,
): Promise<IAttendee[] | null> {
  const session = await auth();
  if (!session) return null;

  const isAdmin = await getAdminById(adminId);
  if (!isAdmin) return null;

  const { data } = await supabase
    .from("attendees")
    .select("*")
    .order("name", { ascending: true });

  return data;
}

export async function getAllAdminsByAdminId(
  adminId: string,
): Promise<IAdmin[] | null> {
  const session = await auth();
  if (!session) return null;

  const isAdmin = await getAdminById(adminId);
  if (!isAdmin) return null;

  const { data } = await supabase
    .from("admins")
    .select("*")
    .order("name", { ascending: true });

  return data;
}

export async function getAdminByAdminId(
  adminId: string,
): Promise<IAdmin | null> {
  const session = await auth();
  if (!session) return null;

  const isAdmin = await getAdminById(adminId);
  if (!isAdmin) return null;

  const { data } = await supabase
    .from("admins")
    .select("*")
    .eq("id", adminId)
    .single();

  return data;
}

export async function getAdminByEmailId(email: string): Promise<IAdmin | null> {
  const session = await auth();
  if (!session) return null;

  const isAdmin = await getAdminById(email);
  if (!isAdmin) return null;

  const { data } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .single();

  return data;
}

export async function getAllAttendeesByQuery(
  query: string,
): Promise<IAttendee[] | null> {
  const session = await auth();
  if (!session) return null;

  const { data } = await supabase
    .from("attendees")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("name", { ascending: true });

  return data;
}

export async function getAttendeeByName(
  name: string,
): Promise<IAttendee | null> {
  const session = await auth();
  if (!session) return null;

  const { data } = await supabase
    .from("attendees")
    .select("*")
    .eq("name", name)
    .single();
  return data;
}

export async function getAttendeeByStudentNumber(
  studentNumber: string,
): Promise<IAttendee | null> {
  const session = await auth();
  if (!session) return null;

  const { data } = await supabase
    .from("attendees")
    .select("*")
    .eq("studentNumber", studentNumber)
    .single();
  return data;
}

export async function getAttendeeByUserId(
  userId: string,
): Promise<IAttendee | null> {
  const session = await auth();
  if (!session) return null;

  const { data } = await supabase
    .from("attendees")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}
