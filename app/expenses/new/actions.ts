"use server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export async function createExpense(
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
  const category_id = Number(
    formData.get("category_id")
  );

  const subcategoryValue =
    formData.get("subcategory_id");
  
  const subcategory_id = 
    subcategoryValue
      ? Number(subcategoryValue)
      : null;

  const result = await supabase
    .from("expenses")
    .insert({
      household_id: HOUSEHOLD_ID,
      date,
      amount,
      description,
      category_id,
      subcategory_id,
    });
  console.log(result);
  redirect("/");
}
