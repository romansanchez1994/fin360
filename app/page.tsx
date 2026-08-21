import { generateRecurringExpenses } from "./recurrentes/generateRecurringExpenses";
import CategoryDonut from "@/components/dashboard/CategoryDonut";
import DeleteButton from "@/components/DeleteButton";
import ExpenseTrend from "@/components/dashboard/ExpenseTrend";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { deleteExpense } from "./expenses/deleteExpense";
import { deleteIncome } from "./incomes/deleteIncome";
export const dynamic = "force-dynamic";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export default async function Home({
    searchParams,
  }: {
    searchParams: Promise<{
      month?: string;
      year?: string;
    }>;
  }) {
  const params = await searchParams;
  const { data: household } = await supabase
    .from("households")
    .select("*")
    .eq("id", HOUSEHOLD_ID)
    .single();

  const now = new Date();
  
  const currentMonth =
    params.month !== undefined
      ? Number(params.month)
      : now.getMonth();
  
  const currentYear =
    params.year !== undefined
      ? Number(params.year)
      : now.getFullYear();

  await generateRecurringExpenses(
    currentMonth,
    currentYear,
  );
  
  const currentDate = new Date(
    currentYear,
    currentMonth,
  );
  
  const currentMonthLabel =
    currentDate.toLocaleDateString(
      "es-ES",
      {
        month: "long",
        year: "numeric",
      }
    ).replace(" de ", " ");

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
  const isCurrentMonth =
    currentMonth === now.getMonth() &&
    currentYear === now.getFullYear();
  const expensesCurrentMonth =
    (expenses ?? []).filter(
      (expense) => {
        const date =
          new Date(expense.date);
  
        return (
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear
        );
      }
    );
  
  const incomesCurrentMonth =
    (incomes ?? []).filter(
      (income) => {
        const date =
          new Date(income.date);
  
        return (
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear
        );
      }
    );
  const ultimosGastos =
  expenses
    ?.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 6) ?? [];

  const totalGastos =
    expensesCurrentMonth.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    ) ?? 0;
  const totalIngresos =
    incomesCurrentMonth.reduce(
      (total, income) =>
        total + Number(income.amount),
      0
    ) ?? 0;
  
  const balance =
    totalIngresos - totalGastos;

  const numeroGastos = expensesCurrentMonth.length;

  const numeroMovimientos =
    expensesCurrentMonth.length +
    incomesCurrentMonth.length;
  const movimientos = [
    ...(expenses ?? []).map((expense) => ({
      ...expense,
      tipo: "gasto",
    })),
    ...(incomes ?? []).map((income) => ({
      ...income,
      tipo: "ingreso",
    })),
  ];
  
  const ultimosMovimientos =
    movimientos
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
      .slice(0, 6);
  
  const gastosPorCategoria: {
    name: string;
    total: number;
  }[]=
    Object.values(
      expensesCurrentMonth.reduce(
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
         <div className="flex items-center justify-between text-white/70 text-sm">
           <Link href={`/?month=${previousDate.getMonth()}&year=${previousDate.getFullYear()}`}>
             ◀
           </Link>

           <span className="capitalize">
             {currentMonthLabel}
           </span>
  
           <Link href={`/?month=${nextDate.getMonth()}&year=${nextDate.getFullYear()}`}>
             ▶
           </Link>
         </div>
        </p>
        <p className="text-white/70 text-sm">
          Resumen financiero
        </p>
      
        <h2 className="text-5xl font-bold mt-3">
          {balance.toFixed(2)} €
        </h2>
      
        <p className="text-white/60 mt-2">
          Balance actual
        </p>
        
        <ExpenseTrend 
          expenses={expensesCurrentMonth}
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

      <div className="mt-4 text-center">
        <Link
          href={`/in?month=${currentMonth}&year=${currentYear}`}
          className="text-blue-500">
          📊 Ver informe mensual →
        </Link>
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
    Últimos movimientos
  </h2>

        <div className="space-y-2">
          {ultimosMovimientos.map((movimiento, index) => {
            const deleteAction =
              movimiento.tipo === "ingreso"
                ? deleteIncome.bind(
                    null,
                    movimiento.id
                  )
                : deleteExpense.bind(
                    null,
                    movimiento.id
                  );
            
            return (
              <div
                key={movimiento.id}
                className={`flex  justify-between p-4 rounded-2xl mb-3 ${
                  index % 2 === 0
                    ? "bg-zinc-900"
                    : "bg-zinc-800"
                }`}
              >
                <div>
                  <div className="text-xs text-gray-500">
                    {new Date(movimiento.date).toLocaleDateString("es-ES",
                                                             {
                                                               day: "2-digit",
                                                               month: "2-digit",
                                                               year: "numeric",
                                                             }
                    )}
                  </div>

                  <div className="font-medium text-white">
                    {movimiento.tipo === "ingreso"
                      ? "💰 "
                      : "💸 "}
                    {movimiento.description}
                  </div>
                  

                  <div className="text-sm text-gray-400">
                    {movimiento.categories?.name}

                    {movimiento.subcategories?.name
                    ? ` · ${movimiento.subcategories.name}`
                    : ""}
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <Link
                      href={
                        movimiento.tipo === "ingreso"
                          ? `/incomes/${movimiento.id}/edit`
                          : `/expenses/${movimiento.id}/edit`
                      }
                      className="text-blue-400 text-sm"
                    >
                      ✏️ Editar
                    </Link>
                    <form action={deleteAction}>
                      <DeleteButton />
                    </form>
                  </div>
                </div>
                <span
                  className={`font-semibold text-lg ${
                    movimiento.tipo === "ingreso"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {movimiento.tipo === "ingreso"
                    ? "+"
                    : "-"}
                  {Number(movimiento.amount).toFixed(2)} €
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
            <div className="mt-2 text-right">
              <Link href="/recurrentes">
                Ver gastos recurrentes →
              </Link>
            </div>
        </div>
      </div>
    </main>
  );
}
