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
  await supabase
    .from("expenses")
    .update({
      amount,
      description,
      date,
      category_id,
      subcategory_id;
    })
    .eq("id", id);
  .select();
  console.log(result);

  redirect("/");
}
