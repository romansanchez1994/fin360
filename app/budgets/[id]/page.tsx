import { supabase } from "@/lib/supabase/client";

export default async function EditBudgetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: budget } = await supabase
    .from("budgets")
    .select("*")
    .eq("id", id)
    .single();

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-6">
        ✏️ Editar presupuesto
      </h1>

      <form>
        <label className="block mb-2">
          Importe (€)
        </label>

        <input
          type="number"
          step="0.01"
          defaultValue={budget.amount}
          className="w-full p-3 rounded bg-zinc-900"
        />

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 p-3 rounded"
        >
          Guardar cambios
        </button>
      </form>
    </main>
  );
}
