import { supabase } from "@/lib/supabase/client";
import { updateExpense } from "./actions";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const { data: expense } = await supabase
        .from("expenses")
        .select("*")
        .eq("id", id)
        .single();

    const updateExpenseWithId =
        updateExpense.bind(null, id);
        
  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Editar gasto
      </h1>

      <form action={updateExpenseWithId} className="space-y-4">
        <div>
            <label className="block mb-1">
                Descripción
            </label>

            <input
                name="description"
                type="text"
                defaultValue={expense?.description}
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
                defaultValue={expense?.amount}
                className="w-full border rounded-lg p-3"
            />
        </div>

        <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
            >
            Guardar cambios
        </button>
        </form>
    </main>
  );
}