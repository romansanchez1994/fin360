"use server";

import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export async function deleteExpense(
  id: string
) {
  await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  redirect("/");
}