"use server";

import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export async function updateIncome(
  id: string,
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
    .update({
      amount,
      description,
      date,
    })
    .eq("id", id);

  redirect("/");
}
