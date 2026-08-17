
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { deleteExpense } from "./expenses/deleteExpense";
export const dynamic = "force-dynamic";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export default async function Home() {
  const { data: household } = await supabase
    .from("households")
    .select("*")
    .eq("id", HOUSEHOLD_ID)
    .single();

  const { data: expenses } = await supabase
    .from("expenses")
    .select(`
      *,
      categories (
        name
      ),
      subcategories (
        name
      )
    `)
    .eq("household_id", HOUSEHOLD_ID);

  const ultimosGastos =
  expenses
    ?.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 10) ?? [];

  const totalGastos =
    expenses?.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    ) ?? 0;

  const numeroGastos = expenses?.length ?? 0;

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-8">
        🏠 {household?.name}
      </h1>

      <div className="border rounded-xl p-4 mb-4">
        <h2 className="text-gray-500">
          Gasto total
        </h2>

        <p className="text-3xl font-bold">
          {totalGastos.toFixed(2)} €
        </p>
      </div>

            <div className="border rounded-xl p-4 mb-4">
        <h2 className="text-gray-500">
          Gastos registrados
        </h2>

        <p className="text-3xl font-bold">
          {numeroGastos}
        </p>
      </div>

      <Link
        href="/expenses/new"
        className="
          fixed
          bottom-6
          right-6
          w-14
          h-14
          rounded-full
          bg-blue-600
          text-white
          text-3xl
          flex
          items-center
          justify-center
          "
        >
          +
      </Link>

      <div className="border rounded-xl p-4 mb-4">
  <h2 className="text-gray-500 mb-3">
    Últimos gastos
  </h2>

        <div className="space-y-2">
          {ultimosGastos.map((gasto) => {
            const deleteExpenseWithId =
              deleteExpense.bind(null,gasto.id);
            
            return (
              <div
                key={gasto.id}
                className="flex justify-between"
              >
                <div>
                  <div>
                    {gasto.description}
                  </div>

                  <div className="text-xs text-gray-500">
                    {gasto.categories?.name}

                    {gasto.subcategories?.name
                    ? ` · ${gasto.subcategories.name}`
                    : ""}
                  </div>
                  <Link href={`/expenses/${gasto.id}/edit`}>
                      Editar
                  </Link>
                  <form action={deleteExpenseWithId}>
                    <button
                        type="submit"
                        className="text-red-600 text-sm"
                        >
                          Eliminar
                    </button>
                  </form>
                </div>
                <span className="font-semibold">
                  {Number(gasto.amount).toFixed(2)} €
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  );
}
