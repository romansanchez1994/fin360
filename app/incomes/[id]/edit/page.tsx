import { supabase } from "@/lib/supabase/client";
import { updateIncome } from "./actions";

export default async function EditIncomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: income } = await supabase
    .from("incomes")
    .select("*")
    .eq("id", id)
    .single();

  const updateIncomeWithId =
    updateIncome.bind(null, id);

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Editar ingreso
      </h1>

      <form
        action={updateIncomeWithId}
        className="space-y-4"
      >
        <div>
          <label className="block mb-1">
            Descripción
          </label>

          <input
            name="description"
            type="text"
            defaultValue={income?.description}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1">
            Importe
          </label>

          <input
            name="amount"
            type="number"
            step="0.01"
            defaultValue={income?.amount}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1">
            Fecha
          </label>

          <input
            name="date"
            type="date"
            defaultValue={income?.date}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg"
        >
          Guardar cambios
        </button>
      </form>
    </main>
  );
}
