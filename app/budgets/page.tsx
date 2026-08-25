import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export default async function BudgetsPage({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}) {
  const params = await searchParams;

  const now = new Date();

  const currentMonth =
    params.month !== undefined
      ? Number(params.month)
      : now.getMonth();

  const currentYear =
    params.year !== undefined
      ? Number(params.year)
      : now.getFullYear();
    const currentDate = new Date(
    currentYear,
    currentMonth,
    1
  );

  const currentMonthLabel =
    currentDate
      .toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      })
      .replace(" de ", " ");
    const previousDate = new Date(
    currentYear,
    currentMonth - 1,
    1
  );

  const nextDate = new Date(
    currentYear,
    currentMonth + 1,
    1
  );
  const { data: budgets } =
    await supabase
      .from("budgets")
      .select(`
        *,
        categories (
          name
        )
      `)
      .eq(
        "household_id",
        HOUSEHOLD_ID
      )
      .eq("month", currentMonth)
      .eq("year", currentYear);
    return (
    <main className="p-6 max-w-md mx-auto">
      <Link
        href="/"
        className="text-blue-400">
        ← Dashboard
      </Link>

      <div className="flex items-center justify-between mt-6">
        <Link
          href={`/budgets?month=${previousDate.getMonth()}&year=${previousDate.getFullYear()}`}
        >
          ◀
        </Link>

        <h1 className="text-xl font-bold capitalize">
          🎯 Presupuestos · {currentMonthLabel}
        </h1>

        <Link
          href={`/budgets?month=${nextDate.getMonth()}&year=${nextDate.getFullYear()}`}
        >
          ▶
        </Link>
      </div>
      <div className="mt-4 mb-6">
        <Link
          href={`/budgets/new?month=${currentMonth}&year=${currentYear}`}
          className="text-blue-400"
        >
          ➕ Nuevo presupuesto
        </Link>
      </div>
      <pre>
        {JSON.stringify(budgets, null, 2)}
      </pre>

        <div className="mt-6">
        {!budgets?.length ? (

          <div className="bg-zinc-900 rounded-2xl p-6 text-center text-gray-400">
            No hay presupuestos para este mes
          </div>
        ) : (
          budgets.map((budget) => (
            <div
              key={budget.id}
              className="bg-zinc-900 rounded-2xl p-4 mb-4"
            >
              <h2 className="font-semibold">
                {budget.categories?.name}
              </h2>

              <div className="mt-2">
                Presupuesto:
                {" "}
                {Number(
                  budget.amount
                ).toFixed(2)}
                €
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
