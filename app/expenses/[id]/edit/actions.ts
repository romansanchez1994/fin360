"use server";

import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export async function updateExpense(
  id: string,
  formData: FormData
) {
  const amount = Number(
    formData.get("amount")
  );

  const description = String(
    formData.get("description")
  );

  await supabase
    .from("expenses")
    .update({
      amount,
      description,
    })
    .eq("id", id);

  redirect("/");
}