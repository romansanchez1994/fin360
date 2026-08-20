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
  const isRecurring =
    formData.get("is_recurring") === "on";
  
  const frecuencia = String(
    formData.get("frecuencia") ?? ""
  );
  
  const fecha_fin =
    formData.get("fecha_fin")
      ? String(formData.get("fecha_fin"))
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
      is_recurring: isRecurring,
    });
    if (isRecurring) {
    await supabase
      .from("gastos_recurrentes")
      .insert({
        household_id: HOUSEHOLD_ID,
        nombre: description,
        importe: amount,
        categoria_id: category_id,
        subcategoria_id: subcategory_id,
        frecuencia,
        fecha_inicio: date,
        fecha_fin,
        activo: true,
      });
  }
  console.log(result);
  redirect("/");
}
