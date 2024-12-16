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
  email: string;
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

export async function getAttendieByEmail(
  email: string,
): Promise<IAdmin | null> {
  const session = await auth();
  if (!session) return null;

  const { data } = await supabase
    .from("attendies")
    .select("*")
    .eq("email", email)
    .single();
  return data;
}
