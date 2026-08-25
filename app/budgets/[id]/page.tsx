import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { updateBudget } from "./updateBudget";

export default async function EditBudgetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: budget } = await supabase
    .from("budgets")
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq("id", id)
    .single();
  const monthLabel = new Date(
    budget.year,
    budget.month,
    1
  ).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
  return (
    <main className="p-6 max-w-md mx-auto">
      <Link
        href="/budgets"
        className="text-blue-400">
        ← Presupuestos
      </Link>
      <h1 className="text-xl font-bold mb-6">
        ✏️ Editar presupuesto
      </h1>

      <div className="bg-zinc-900 rounded-2xl p-4 mb-6">
        <div className="text-sm text-gray-400">
          Categoría
        </div>
      
        <div className="font-semibold">
          {budget.categories?.name}
        </div>
      
        <div className="text-sm text-gray-400 mt-3">
          Mes
        </div>
      
        <div>
          {monthLabel}
        </div>
      </div>
      <form action={updateBudget.bind(null,id)}>
        <label className="block mb-2">
          Importe (€)
        </label>
      
        <input
          type="number"
          name="amount"
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
