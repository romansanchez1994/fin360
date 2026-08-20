import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import DeleteButton from "@/components/DeleteButton";
import { deleteRecurrente } from "./deleteRecurrente";
import { toggleActivo } from "./toggleActivo";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export default async function RecurrentesPage() {
  const { data: recurrentes } = await supabase
    .from("gastos_recurrentes")
    .select("*")
    .eq("household_id", HOUSEHOLD_ID)
    .order("created_at", {
      ascending: false,
    });

  return (
    <main className="max-w-md mx-auto p-6">
      <Link
        href="4 inline-block"
      >
        ← Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-6">
        Gastos recurrentes
      </h1>

      <div className="space-y-4">
        {(recurrentes ?? []).map(
          (recurrente) => (
            <div
              key={recurrente.id}
              className="border rounded-xl p-4"
            >
              <div className="font-semibold text-lg">
                {recurrente.nombre}
              </div>

              <div className="text-green-400 font-bold mt-1">
                {Number(
                  recurrente.importe
                ).toFixed(2)} €
              </div>

              <div className="text-gray-500 mt-1">
                {recurrente.frecuencia}
              </div>

              <div className="text-sm text-gray-400 mt-2">
                {recurrente.fecha_inicio}

                {recurrente.fecha_fin
                  ? ` → ${recurrente.fecha_fin}`
                  : ""}
              </div>

              <div className="mt-3 text-sm">
                {recurrente.activo
                  ? "✅ Activo"
                  : "⏸️ Inactivo"}
              </div>
              <div>
                <form action={toggleActivo.bind(
                  null,
                  recurrente.id,
                  recurrente.activo,
                )}>
                  <button 
                    type="submit"
                    className="text-yellow-400 text-sm"
                  >
                    {recurrente.activo
                      ? "⏸️ Desactivar"
                      : "▶️ Activar"
                    }
                  </button>
                </form>
              </div>
              <div className="flex gap-4 mt-3">
                <form action={deleteRecurrente.bind(
                  null,
                  recurrente.id
                )}>
                  <DeleteButton />
                </form>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}
