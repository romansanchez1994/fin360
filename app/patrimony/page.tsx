import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import PatrimonyTrend from "@/components/dashboard/PatrimonyTrend";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

const currencyFormatter =
  new Intl.NumberFormat(
    "es-ES",
    {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

export default async function PatrimonyPage() {
  /*
   * Perfil financiero
   */

  const { data: profile } =
    await supabase
      .from("financial_profile")
      .select("*")
      .eq(
        "household_id",
        HOUSEHOLD_ID
      )
      .single();

  /*
   * Ingresos históricos
   *
   * Ojo: la tabla utilizada en el resto
   * de FIN360 es "incomes", en plural.
   */

  const { data: incomes } =
    await supabase
      .from("incomes")
      .select("*")
      .eq(
        "household_id",
        HOUSEHOLD_ID
      );

  /*
   * Gastos históricos
   */

  const { data: expenses } =
    await supabase
      .from("expenses")
      .select("*")
      .eq(
        "household_id",
        HOUSEHOLD_ID
      );

  /*
   * Objetivos del hogar
   */

  const { data: goals } =
    await supabase
      .from("financial_goals")
      .select("id")
      .eq(
        "household_id",
        HOUSEHOLD_ID
      );

  const goalIds =
    (goals ?? []).map(
      (goal) => goal.id
    );

  /*
   * Aportaciones de los objetivos
   *
   * Se filtran por los objetivos
   * pertenecientes al hogar actual.
   */

  let contributions: {
    amount: number | string;
  }[] = [];

  if (goalIds.length > 0) {
    const {
      data: contributionsData,
    } =
      await supabase
        .from(
          "goal_contributions"
        )
        .select("amount")
        .in(
          "goal_id",
          goalIds
        );

    contributions =
      contributionsData ?? [];
  }

  /*
   * Cálculos patrimoniales
   */

  const initialLiquidity =
    Number(
      profile?.initial_liquidity ??
        0
    );

  const totalIncome =
    (incomes ?? []).reduce(
      (total, income) =>
        total +
        Number(income.amount),
      0
    );

  const totalExpenses =
    (expenses ?? []).reduce(
      (total, expense) =>
        total +
        Number(expense.amount),
      0
    );

  const accumulatedBalance =
    totalIncome - totalExpenses;

  const fundedGoals =
    contributions.reduce(
      (
        total,
        contribution
      ) =>
        total +
        Number(
          contribution.amount
        ),
      0
    );

  const totalPatrimony =
    initialLiquidity +
    accumulatedBalance;

  const availableLiquidity =
    totalPatrimony -
    fundedGoals;

  /*
   * Movimientos agrupados por mes
   * para construir el gráfico.
   */

  const monthlyMovements: Record<
    string,
    number
  > = {};

  (incomes ?? []).forEach(
    (income) => {
      const date =
        new Date(income.date);

      const key =
        `${date.getFullYear()}-` +
        `${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

      monthlyMovements[key] =
        (
          monthlyMovements[key] ??
          0
        ) +
        Number(income.amount);
    }
  );

  (expenses ?? []).forEach(
    (expense) => {
      const date =
        new Date(expense.date);

      const key =
        `${date.getFullYear()}-` +
        `${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

      monthlyMovements[key] =
        (
          monthlyMovements[key] ??
          0
        ) -
        Number(expense.amount);
    }
  );

  const orderedMonths =
    Object.keys(
      monthlyMovements
    ).sort();

  let runningPatrimony =
    initialLiquidity;

  const patrimonyHistory = [
    {
      label: "Inicio",
      value: initialLiquidity,
    },

    ...orderedMonths.map(
      (monthKey) => {
        runningPatrimony +=
          monthlyMovements[
            monthKey
          ];

        const [
          year,
          month,
        ] =
          monthKey
            .split("-")
            .map(Number);

        const label =
          new Date(
            year,
            month - 1,
            1
          )
            .toLocaleDateString(
              "es-ES",
              {
                month: "short",
                year: "2-digit",
              }
            )
            .replace(".", "");

        return {
          label,
          value:
            runningPatrimony,
        };
      }
    ),
  ];

  
  
  return (
    <main className="p-6 max-w-md mx-auto">
      {/* Navegación */}

      <div className="mb-6">
        <Link href="/">
          ← Volver al dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        🏦 Patrimonio
      </h1>

      {/* Tarjeta 1: grafico patrmonial */}

      <section
        className="
          rounded-3xl
          border
          border-zinc-700
          bg-zinc-950
          p-6
          shadow-xl
        "
      >
        <div className="mb-5">
          <h2 className="text-xl font-bold">
            Evolución del patrimonio
          </h2>
      
          <p className="text-sm text-gray-400 mt-1">
            Patrimonio acumulado desde el inicio
            del seguimiento
          </p>
        </div>
      
        <PatrimonyTrend
          data={patrimonyHistory}
        />
      
        <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
          <span>
            Inicio:{" "}
            {currencyFormatter.format(
              initialLiquidity
            )}
          </span>
      
          <span>
            Actual:{" "}
            {currencyFormatter.format(
              totalPatrimony
            )}
          </span>
        </div>
      </section>
    </main>
  );
}
