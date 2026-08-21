"use server";

import { supabase } from "@/lib/supabase/client";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export async function generateRecurringExpenses(
  month: number,
  year: number
) {
  const { data: recurrentes } = await supabase
    .from("gastos_recurrentes")
    .select("*")
    .eq("household_id", HOUSEHOLD_ID)
    .eq("activo", true);

  for (const recurrente of recurrentes ?? []) {
    const fechaInicio = new Date(
      recurrente.fecha_inicio
    );

    const diferenciaMeses =
      (year - fechaInicio.getFullYear()) * 12 +
      (month - fechaInicio.getMonth());

    if (diferenciaMeses < 0) {
      continue;
    }

    if (
      recurrente.frecuencia === "trimestral" &&
      diferenciaMeses % 3 !== 0
    ) {
      continue;
    }

    if (
      recurrente.frecuencia === "anual" &&
      diferenciaMeses % 12 !== 0
    ) {
      continue;
    }

    const fechaObjetivo = new Date(
      year,
      month,
      fechaInicio.getDate()
    );

    if (fechaObjetivo < fechaInicio) {
      continue;
    }

    if (
      recurrente.fecha_fin &&
      fechaObjetivo >
        new Date(recurrente.fecha_fin)
    ) {
      continue;
    }

    const fechaISO =
      fechaObjetivo
        .toISOString()
        .split("T")[0];

    const { data: existente } = await supabase
      .from("expenses")
      .select("id")
      .eq(
        "recurring_expense_id",
        recurrente.id
      )
      .eq("date", fechaISO)
      .maybeSingle();

    if (existente) {
      continue;
    }

    await supabase
      .from("expenses")
      .insert({
        household_id: HOUSEHOLD_ID,
        date: fechaISO,
        amount: recurrente.importe,
        description: recurrente.nombre,
        category_id:
          recurrente.categoria_id,
        subcategory_id:
          recurrente.subcategoria_id,
        is_recurring: true,
        recurring_expense_id:
          recurrente.id,
      });
  }
}
