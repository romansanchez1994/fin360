"use server";

import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export async function updateRecurrente(
  id: string,
  formData: FormData
) {
  const nombre = String(
    formData.get("nombre")
  );

  const importe = Number(
    formData.get("importe")
  );

  const frecuencia = String(
    formData.get("frecuencia")
  );

  const fecha_inicio = String(
    formData.get("fecha_inicio")
  );

  const fecha_fin =
    formData.get("fecha_fin")
      ? String(formData.get("fecha_fin"))
      : null;

  await supabase
    .from("gastos_recurrentes")
    .update({
      nombre,
      importe,
      frecuencia,
      fecha_inicio,
      fecha_fin,
    })
    .eq("id", id);

  redirect("/recurrentes");
}
