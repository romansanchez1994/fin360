"use server";

import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export async function createIncome(
  formData: FormData
) {
  const amount = Number(
    formData.get("amount")
  );

  const description = String(
    formData.get("description")
  );

  const date = String(
    formData.get("date")
  );

  await supabase
    .from("incomes")
    .insert({
      household_id: HOUSEHOLD_ID,
      amount,
      description,
      date,
    });

  redirect("/");
}
