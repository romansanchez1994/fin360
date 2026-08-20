import CategoryDonut from "@/components/dashboard/CategoryDonut";
import DeleteButton from "@/components/DeleteButton";
import ExpenseTrend from "@/components/dashboard/ExpenseTrend";
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
  const { data: incomes } = await supabase
    .from("incomes")
    .select("*")
    .eq("household_id", HOUSEHOLD_ID);

  const ultimosGastos =
  expenses
    ?.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 6) ?? [];

  const totalGastos =
    expenses?.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    ) ?? 0;
  const totalIngresos =
    incomes?.reduce(
      (total, income) =>
        total + Number(income.amount),
      0
    ) ?? 0;
  
  const balance =
    totalIngresos - totalGastos;

  const numeroGastos = expenses?.length ?? 0;

  const numeroMovimientos =
    (expenses?.length ?? 0) +
    (incomes?.length ?? 0);
  const gastosPorCategoria: {
    name: string;
    total: number;
  }[]=
    Object.values(
      (expenses ?? []).reduce(
        (acc: any, gasto: any) => {
          const nombre =
            gasto.categories?.name ?? "Sin categoría";
  
          if (!acc[nombre]) {
            acc[nombre] = {
              name: nombre,
              total: 0,
            };
          }
  
          acc[nombre].total += Number(
            gasto.amount
          );
  
          return acc;
        },
        {}
      )
  );
  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-8">
        🏠 {household?.name}
      </h1>
      <div
        className="
          mb-6
          rounded-3xl
          p-6
          text-white
          shadow-xl
          bg-gradient-to-r
          from-emerald-900
          via-teal-900
          to-slate-900
        "
      >
        <p className="text-white/70 text-sm">
          Resumen financiero
        </p>
      
        <h2 className="text-5xl font-bold mt-3">
          {balance.toFixed(2)} €
        </h2>
      
        <p className="text-white/60 mt-2">
          Balance Actual
        </p>
        
        <ExpenseTrend 
          expenses={expenses ?? []}
        />
        
        <div className="border-t border-white/20 mt-6 pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
      
            <div>
              <p className="text-white/60 text-xs">
                Ingresos
              </p>
      
              <p className="text-green-400 font-bold text-lg">
                {totalIngresos.toFixed(2)} €
              </p>
            </div>
      
            <div>
              <p className="text-white/60 text-xs">
                Gastos
              </p>
      
              <p className="text-red-400 font-bold text-lg">
                {totalGastos.toFixed(2)} €
              </p>
            </div>
      
            <div>
              <p className="text-white/60 text-xs">
                Movimientos
              </p>
      
              <p className="font-bold text-lg">
                {numeroMovimientos}
              </p>
            </div>
      
          </div>
        </div>
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
      <Link
        href="/incomes/new"
        className="
          fixed
          bottom-24
          right-6
          w-14
          h-14
          rounded-full
          bg-green-600
          text-white
          text-2xl
          flex
          items-center
          justify-center
        "
      >
        €
      </Link>
      
  <CategoryDonut 
    data={gastosPorCategoria}  
  />
      <div className="border rounded-xl p-4 mb-4">
  <h2 className="text-gray-500 mb-3">
    Últimos gastos
  </h2>

        <div className="space-y-2">
          {ultimosGastos.map((gasto, index) => {
            const deleteExpenseWithId =
              deleteExpense.bind(null,gasto.id);
            
            return (
              <div
                key={gasto.id}
                className={`flex  justify-between p-4 rounded-2xl mb-3 ${
                  index % 2 === 0
                    ? "bg-zinc-900"
                    : "bg-zinc-800"
                }`}
              >
                <div>
                  <div className="text-xs text-gray-500">
                    {new Date(gasto.date).toLocaleDateString("es-ES",
                                                             {
                                                               day: "2-digit",
                                                               month: "2-digit",
                                                               year: "numeric",
                                                             }
                    )}
                  </div>

                  <div className="font-medium text-white">
                    {gasto.description}
                  </div>
                  

                  <div className="text-sm text-gray-400">
                    {gasto.categories?.name}

                    {gasto.subcategories?.name
                    ? ` · ${gasto.subcategories.name}`
                    : ""}
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <Link href={`/expenses/${gasto.id}/edit`}className="text-blue-400 text-sm">
                        ✏️ Editar
                    </Link>
                    <form action={deleteExpenseWithId}>
                      <DeleteButton />
                    </form>
                  </div>
                </div>
                <span className="font-semibold text-white text-lg">
                  {Number(gasto.amount).toFixed(2)} €
                </span>
              </div>
            )
          })}
            <div className="mt-4 text-right">
              <Link
                href="/informes">
                  Ver todos los gastos →
              </Link>
            </div>
        </div>
      </div>
    </main>
  );
}
