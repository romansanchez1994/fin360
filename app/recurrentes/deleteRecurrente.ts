"use server";

import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export async function deleteRecurrente(
  id: string
) {
  await supabase
    .from("gastos_recurrentes")
    .delete()
    .eq("id", id);

  redirect("/recurrentes");
}
