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
  .select("*")
  .eq("household_id", HOUSEHOLD_ID);

const { data: incomes } = await supabase
  .from("incomes")
  .select("*")
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
        href={`/?month=${previousDate.getMonth()}&year=${previousDate.getFullYear()}`}
      >
        ◀
      </Link>

      <h1 className="text-3xl font-bold capitalize">
        Informe mensual · {currentMonthLabel}
      </h1>

      {isCurrentMonth ? (
        <span className="opacity-30">
          ▶
        </span>
      ) : (
        <Link
          href={`/?month=${previousDate.getMonth()}&year=${previousDate.getFullYear()}`}
        >
          ▶
        </Link>
      )}
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
    </div>
  </main>
);
