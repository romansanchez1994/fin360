import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { createBudget } from "../createBudget";

export default async function NewBudgetPage({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}) {
  const params = await searchParams;

  const now = new Date();

  const month =
    params.month !== undefined
      ? Number(params.month)
      : now.getMonth();

  const year =
    params.year !== undefined
      ? Number(params.year)
      : now.getFullYear();

  const { data: categories } =
    await supabase
      .from("categories")
      .select("*")
      .order("name");

  return (
    <main className="p-6 max-w-md mx-auto">
      <Link
        href={`/budgets?month=${month}&year=${year}`}
        className="text-blue-400"
      >
        ← Presupuestos
      </Link>

      <h1 className="text-2xl font-bold mt-6 mb-6     className="space-y-4"
      >
        <input
          type="hidden"
          name="month"
          value={month}
        />

        <input
          type="hidden"
          name="year"
          value={year}
        />

        <div>
          <label className="block mb-2">
            Categoría
          </label>

          <select
            name="category_id"
            required
            className="w-full p-3 rounded-xl bg-zinc-900"
          >
            <option value="">
              Selecciona una categoría
            </option>

            {(categories ?? []).map(
              (category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="block mb-2">
            Presupuesto (€)
          </label>

          <input
            type="number"
            step="0.01"
            name="amount"
            required
            className="w-full p-3 rounded-xl bg-zinc-900"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 rounded-xl p-3 font-semibold"
        >
          Guardar presupuesto
        </button>
      </form>
    </main>
  );
}
