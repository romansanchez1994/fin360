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

  const targetAmount =
    Number(
      formData.get("targetAmount")
    );

  const targetDate =
    formData.get("targetDate") as string;

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
    });

  revalidatePath("/goals");
  redirect("/goals");
}
