"use server";

import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export async function deleteIncome(
  id: string
) {
  await supabase
    .from("incomes")
    .delete()
    .eq("id", id);

  redirect("/");
}
