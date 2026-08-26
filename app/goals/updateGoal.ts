"use server";

import { supabase } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateGoal(
  formData: FormData
) {
  const id = Number(
    formData.get("id")
  );

  const name =
    formData.get("name");

  const goalType =
    formData.get("goalType");

  const targetAmount =
    Number(
      formData.get(
        "targetAmount"
      )
    );

  const targetDate =
    formData.get(
      "targetDate"
    );

  const description =
    formData.get(
      "description"
    );

  await supabase
    .from("financial_goals")
    .update({
      name,
      goal_type: goalType,
      target_amount:
        targetAmount,
      target_date:
        targetDate || null,
      description,
    })
    .eq("id", id);

  revalidatePath("/goals");

  redirect("/goals");
}
