"use server";

import { supabase } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export async function createGoal(
  formData: FormData
) {
  const name =
    formData.get("name") as string;

  const description =
    formData.get("description") as string;

  const goalType =
    formData.get("goalType") as string;
  const initialAmount =
    Number(
      formData.get("initialAmount")
    ) || 0;
  const targetAmount =
    Number(
      formData.get("targetAmount")
    );

  const targetDate =
    formData.get("targetDate") as string;
  const { data: goal } =
    await supabase
      .from("financial_goals")
      .insert({
        household_id: HOUSEHOLD_ID,
        name,
        description,
        goal_type: goalType,
        target_amount: targetAmount,
        target_date:
          targetDate || null,
      })
      .select()
      .single();
  await supabase
    .from("goal_contributions")
    .insert({
      goal_id: goal.id,
      amount: initialAmount,
      description:
        "Aportación inicial",
    });
  revalidatePath("/goals");
  redirect("/goals");
}
