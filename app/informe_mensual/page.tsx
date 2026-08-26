import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";
export default async function InformeMensualPage({
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

const isCurrentMonth =
  currentMonth === now.getMonth() &&
  currentYear === now.getFullYear();

const { data: expenses } = await supabase
  .from("expenses")
  .select(`
    *,
    categories (
      name
    )
  `)
  .eq("household_id", HOUSEHOLD_ID);

const { data: incomes } = await supabase
  .from("incomes")
  .select("*")
  .eq("household_id", HOUSEHOLD_ID);
  
const { data: budgets } = await supabase
    .from("budgets")
    .select(`
      *,
      categories (
        id,
        name)`)
    .eq("household_id", HOUSEHOLD_ID);
  
const expensesCurrentMonth =
  (expenses ?? []).filter(
    (expense) => {
      const date = new Date(expense.date);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    }
  );

const incomesCurrentMonth =
  (incomes ?? []).filter(
    (income) => {
      const date = new Date(income.date);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    }
  );

const totalGastos =
  expensesCurrentMonth.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );

const totalIngresos =
  incomesCurrentMonth.reduce(
    (total, income) =>
      total + Number(income.amount),
    0
  );

const balance =
  totalIngresos - totalGastos;

const ahorro =
  totalIngresos > 0
    ? (balance / totalIngresos) * 100
    : 0;
  
const previousMonthDate = new Date(
  currentYear,
  currentMonth - 1,
  1
);

const previousMonth =
  previousMonthDate.getMonth();

const previousYear =
  previousMonthDate.getFullYear();
const expensesPreviousMonth =
  (expenses ?? []).filter(
    (expense) => {
      const date = new Date(expense.date);

      return (
        date.getMonth() === previousMonth &&
        date.getFullYear() === previousYear
      );
    }
  );

const incomesPreviousMonth =
  (incomes ?? []).filter(
    (income) => {
      const date = new Date(income.date);

      return (
        date.getMonth() === previousMonth &&
        date.getFullYear() === previousYear
      );
    }
  );
  const gastosMesAnterior =
  expensesPreviousMonth.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );

const ingresosMesAnterior =
  incomesPreviousMonth.reduce(
    (total, income) =>
      total + Number(income.amount),
    0
  );

const balanceMesAnterior =
  ingresosMesAnterior -
  gastosMesAnterior;

const diferenciaGastos =
  totalGastos - gastosMesAnterior;

const diferenciaIngresos =
  totalIngresos - ingresosMesAnterior;

const diferenciaBalance =
  balance - balanceMesAnterior;
const textoGastos =
  diferenciaGastos >= 0
    ? `🔴 Gastaste ${diferenciaGastos.toFixed(2)} € más`
    : `🟢 Gastaste ${Math.abs(diferenciaGastos).toFixed(2)} € menos`;

const textoIngresos =
  diferenciaIngresos >= 0
    ? `🟢 Ingresaste ${diferenciaIngresos.toFixed(2)} € más`
    : `🔴 Ingresaste ${Math.abs(diferenciaIngresos).toFixed(2)} € menos`;

const textoBalance =
  diferenciaBalance >= 0
    ? `🟢 Tu balance mejoró ${diferenciaBalance.toFixed(2)} €`
    : `🔴 Tu balance empeoró ${Math.abs(diferenciaBalance).toFixed(2)} €`;
const previousMonthLabel =
  previousMonthDate
    .toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    })
    .replace(" de ", " ");

const gastosPorCategoria: Record<
    string,
    number
  > = {};
  expensesCurrentMonth.forEach(
  (expense: any) => {
    const categoria =
      expense.categories?.name ??
      "Sin categoría";

    gastosPorCategoria[categoria] =
      (gastosPorCategoria[categoria] ??
        0) +
      Number(expense.amount);
  }
);

const categoriasOrdenadas =
  Object.entries(
    gastosPorCategoria
  )
    .map(([nombre, importe]) => ({
      nombre,
      importe,
    }))
    .sort(
      (a, b) =>
        b.importe - a.importe
    )
    .slice(0, 5);
const maxCategoria =
  categoriasOrdenadas[0]?.importe ??
  1;

const categoryColors: Record<
    string,
    string
  > = {
    Compras: "#22c55e",
    Alimentación: "#3b82f6",
    Vivienda: "#f59e0b",
    Ocio: "#8b5cf6",
    Transporte: "#ef4444",
  };
  
const totalCategorias =
  categoriasOrdenadas.reduce(
    (total, categoria) =>
      total + categoria.importe,
    0
  );
const presupuestosPorCategoria =
  (budgets ?? []).reduce(
    (acc: any, budget: any) => {
      const nombre =
        budget.categories?.name;

      if (nombre) {
        acc[nombre] = budget;
      }

      return acc;
    },
    {}
  );
const totalBudget =
    (budgets ?? []).reduce(
      (total, budget) =>
        total + Number(budget.amount),
      0
    );
const budgetUsage =
    totalBudget > 0
      ? (totalGastos / totalBudget) * 100
      : 0;
let budgetStatus =
    "Dentro del presupuesto";
  
if (budgetUsage >= 100) {
    budgetStatus =
      "Presupuesto superado";
} else if (budgetUsage >= 80) {
    budgetStatus =
      "Cerca del límite";
}
  
return (
  <main className="max-w-4xl mx-auto p-6">
    <Link
      href="/"
      className="text-blue-500"
    >
      ← Dashboard
    </Link>

    <div className="flex items-center justify-between mt-6">
      <Link
        href={`/informe_mensual?month=${previousDate.getMonth()}&year=${previousDate.getFullYear()}`}
      >
        ◀
      </Link>

      <h1 className="text-3xl font-bold capitalize">
        Informe mensual · {currentMonthLabel}
      </h1>
      <Link
        href={`/informe_mensual?month=${nextDate.getMonth()}&year=${nextDate.getFullYear()}`}
      >
        ▶
      </Link>
    </div>

    <div className="mt-8 border rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">
        Resumen ejecutivo
      </h2>

      <div>
        Ingresos: {totalIngresos.toFixed(2)} €
      </div>

      <div>
        Gastos: {totalGastos.toFixed(2)} €
      </div>

      <div>
        Balance: {balance.toFixed(2)} €
      </div>

      <div>
        Ahorro: {ahorro.toFixed(1)} %
      </div>

      {totalBudget > 0 && (
      <>
        <div className="border-t border-gray-700 my-4" />
    
        <p className="text-gray-400 text-sm">
          Presupuesto mensual
        </p>
    
        <p className="mt-2">
          {totalGastos.toFixed(2)} € de{" "}
          {totalBudget.toFixed(2)} € utilizados (
          {budgetUsage.toFixed(0)}%)
        </p>
        <div className="w-full bg-gray-800 rounded-full h-3 mt-3">
          <div
            className={`h-3 rounded-full ${
              budgetUsage >= 100
                ? "bg-red-500"
                : budgetUsage >= 80
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{
              width: `${Math.min(
                budgetUsage,
                100
              )}%`,
            }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-1">
          {budgetStatus}
        </p>
        <Link
          href="/budgets"
          className="text-blue-500"
        >
          Ver presupuestos →
        </Link>
      </>
    )}
    </div>

    <div className="mt-6 border rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">
        Comparativa con {previousMonthLabel}
      </h2>
    
      <div className="space-y-3">
        <div>{textoGastos}</div>
    
        <div>{textoIngresos}</div>
    
        <div>{textoBalance}</div>
      </div>
    </div>

    <div className="mt-6 border rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">
        Gastos por categorías
      </h2>
    
      <div className="space-y-4">
        {categoriasOrdenadas.map(
          (categoria) => {
            const porcentaje =
              (categoria.importe /
                maxCategoria) *
              100;
            const porcentajeTotal =
              (categoria.importe /
              totalCategorias) *
              100;
    
            return (
              <div
                key={categoria.nombre}
              >
                <div className="flex justify-between mb-1">
                  <span>
                    {categoria.nombre}
                  </span>
    
                  <span>
                    {categoria.importe.toFixed(2)} €
                    {" "}
                    ({porcentajeTotal.toFixed(0)}%)
                  </span>
                </div>
                {presupuestosPorCategoria[
                  categoria.nombre
                ] && (
                  <div className="text-sm text-gray-400 mb-1">
                    Presupuesto:{" "}
                    {(
                      (categoria.importe /
                        Number(
                          presupuestosPorCategoria[
                            categoria.nombre
                          ].amount
                        )) *
                      100
                    ).toFixed(0)}
                    %
                  </div>
                )}
                <div className="w-full bg-gray-800 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{
                      width: `${porcentaje}%`,
                      backgroundColor:
                        categoryColors[
                          categoria.nombre
                        ] ?? "#6b7280",
                    }}
                  />
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>

  </main>
);
}
