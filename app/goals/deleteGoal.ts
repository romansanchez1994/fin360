"use server";

import { supabase } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

export async function deleteGoal(
  id: number
) {
  await supabase
    .from("financial_goals")
    .delete()
    .eq("id", id);

  revalidatePath("/goals");
}
