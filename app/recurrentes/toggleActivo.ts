"use server";

import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export async function toggleActivo(
  id: string,
  activo: boolean
) {
  await supabase
    .from("gastos_recurrentes")
    .update({
      activo: !activo,
    })
    .eq("id", id);

  redirect("/recurrentes");
}
