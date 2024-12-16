import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export interface IAdmin {
  readonly id: string;
  name: string;
  email: string;
  readonly password: string;
}

export interface IAttendie {
  readonly id: string;
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

export async function getAllAttendiesByAdminId(
  adminId: string,
): Promise<IAttendie[] | null> {
  const session = await auth();
  if (!session) return null;

  const isAdmin = await getAdminById(adminId);
  if (!isAdmin) return null;

  const { data } = await supabase
    .from("attendies")
    .select("*")
    .order("name", { ascending: true });

  return data;
}

export async function getAllAttendiesByQuery(
  query: string,
): Promise<IAttendie[] | null> {
  const session = await auth();
  if (!session) return null;

  const { data } = await supabase
    .from("attendies")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("name", { ascending: true });

  return data;
}

export async function getAttendieByName(
  name: string,
): Promise<IAttendie | null> {
  const session = await auth();
  if (!session) return null;

  const { data } = await supabase
    .from("attendies")
    .select("*")
    .eq("name", name)
    .single();
  return data;
}
