import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export default async function InformesPage() {
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

  const gastos =
    expenses?.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    ) ?? [];

  return (
    <main className="p-6 max-w-md mx-auto">
      <Link
        href="/"
        className="text-blue-400"
      >
        ← Dashboard
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-6">
        Informe de gastos
      </h1>

      <div className="space-y-3">
        {gastos.map((gasto, index) => (
          <div
            key={gasto.id}
            className={`p-4 rounded-2xl ${
              index % 2 === 0
                ? "bg-zinc-900"
                : "bg-zinc-800"
            }`}
          >
            <div className="text-xs text-gray-400">
              {new Date(
                gasto.date
              ).toLocaleDateString("es-ES")}
            </div>

            <div className="flex justify-between mt-1">
              <div>
                <div className="font-medium text-white">
                  {gasto.description}
                </div>

                <div className="text-sm text-gray-400">
                  {gasto.categories?.name}
                  {gasto.subcategories?.name
                    ? ` · ${gasto.subcategories.name}`
                    : ""}
                </div>
              </div>

              <span className="font-semibold text-white">
                {Number(gasto.amount).toFixed(2)} €
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

