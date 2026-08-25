"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export async function updateBudget(
  id: string,
  formData: FormData
) {
  const amount = Number(
    formData.get("amount")
  );

  await supabase
    .from("budgets")
    .update({
      amount,
    })
    .eq("id", id);

  revalidatePath("/budgets");

  redirect("/budgets");
}
