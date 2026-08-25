"use server";

import { supabase } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

export async function deleteBudget(
  id: number
) {
  await supabase
    .from("budgets")
    .delete()
    .eq("id", id);

  revalidatePath("/budgets");
}
