"use server";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export async function createBudget(
  formData: FormData
) {
  const category_id = Number(
    formData.get("category_id")
  );

  const amount = Number(
    formData.get("amount")
  );

  const month = Number(
    formData.get("month")
  );

  const year = Number(
    formData.get("year")
  );

  await supabase
    .from("budgets")
    .insert({
      household_id: HOUSEHOLD_ID,
      category_id,
      month,
      year,
      amount,
    });

  redirect(
    `/budgets?month=${month}&year=${year}`
  );
}
