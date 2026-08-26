import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

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

  /*
   * Datos del gráfico SVG
   */

  const chartWidth = 600;
  const chartHeight = 240;

  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartValues =
    patrimonyHistory.map(
      (item) => item.value
    );

  const minimumValue =
    Math.min(
      ...chartValues
    );

  const maximumValue =
    Math.max(
      ...chartValues
    );

  const valueDifference =
    maximumValue -
      minimumValue ||
    1;

  const verticalMargin =
    valueDifference * 0.15;

  const chartMinimum =
    minimumValue -
    verticalMargin;

  const chartMaximum =
    maximumValue +
    verticalMargin;

  const chartRange =
    chartMaximum -
      chartMinimum ||
    1;

  const usableWidth =
    chartWidth -
    paddingLeft -
    paddingRight;

  const usableHeight =
    chartHeight -
    paddingTop -
    paddingBottom;

  const chartPoints =
    patrimonyHistory.map(
      (item, index) => {
        const denominator =
          Math.max(
            patrimonyHistory.length -
              1,
            1
          );

        const x =
          paddingLeft +
          (
            index /
            denominator
          ) *
            usableWidth;

        const y =
          paddingTop +
          (
            (
              chartMaximum -
              item.value
            ) /
            chartRange
          ) *
            usableHeight;

        return {
          ...item,
          x,
          y,
        };
      }
    );

  const linePoints =
    chartPoints
      .map(
        (point) =>
          `${point.x},${point.y}`
      )
      .join(" ");

  const areaPoints =
    chartPoints.length > 0
      ? [
          `${chartPoints[0].x},${
            chartHeight -
            paddingBottom
          }`,
          ...chartPoints.map(
            (point) =>
              `${point.x},${point.y}`
          ),
          `${
            chartPoints[
              chartPoints.length -
                1
            ].x
          },${
            chartHeight -
            paddingBottom
          }`,
        ].join(" ")
      : "";

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

      {/* Tarjeta 1: resumen patrimonial */}

      <section
        className="
          rounded-3xl
          border
          border-zinc-700
          bg-zinc-950
          p-6
          shadow-xl
          mb-6
        "
      >
        <p className="text-sm text-gray-400">
          Patrimonio total
        </p>

        <p className="text-4xl font-bold mt-2">
          {currencyFormatter.format(
            totalPatrimony
          )}
        </p>

        <div className="border-t border-white/10 mt-6 pt-6">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-gray-400">
                Liquidez disponible
              </p>

              <p className="text-xl font-semibold text-blue-400 mt-1">
                {currencyFormatter.format(
                  availableLiquidity
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Liquidez inicial
              </p>

              <p className="text-xl font-semibold mt-1">
                {currencyFormatter.format(
                  initialLiquidity
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Balance acumulado
              </p>

              <p
                className={`
                  text-xl
                  font-semibold
                  mt-1
                  ${
                    accumulatedBalance >=
                    0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                `}
              >
                {currencyFormatter.format(
                  accumulatedBalance
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Objetivos financiados
              </p>

              <p className="text-xl font-semibold mt-1">
                {currencyFormatter.format(
                  fundedGoals
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tarjeta 2: gráfico patrimonial */}

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
            Patrimonio acumulado desde
            el inicio del seguimiento
          </p>
        </div>

        {chartPoints.length > 1 ? (
          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto"
              role="img"
              aria-label="Gráfico de evolución del patrimonio"
            >
              <defs>
                <linearGradient
                  id="patrimonyArea"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#22c55e"
                    stopOpacity="0.35"
                  />

                  <stop
                    offset="100%"
                    stopColor="#22c55e"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {/* Líneas horizontales */}

              {[0, 1, 2, 3].map(
                (line) => {
                  const y =
                    paddingTop +
                    (
                      line /
                      3
                    ) *
                      usableHeight;

                  return (
                    <line
                      key={line}
                      x1={paddingLeft}
                      x2={
                        chartWidth -
                        paddingRight
                      }
                      y1={y}
                      y2={y}
                      stroke="#3f3f46"
                      strokeWidth="1"
                      strokeDasharray="5 5"
                    />
                  );
                }
              )}

              {/* Área bajo la curva */}

              <polygon
                points={areaPoints}
                fill="url(#patrimonyArea)"
              />

              {/* Línea principal */}

              <polyline
                points={linePoints}
                fill="none"
                stroke="#22c55e"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Puntos y etiquetas */}

              {chartPoints.map(
                (
                  point,
                  index
                ) => (
                  <g key={`${point.label}-${index}`}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="6"
                      fill="#09090b"
                      stroke="#22c55e"
                      strokeWidth="4"
                    />

                    <text
                      x={point.x}
                      y={
                        chartHeight -
                        16
                      }
                      fill="#a1a1aa"
                      fontSize="17"
                      textAnchor="middle"
                    >
                      {point.label}
                    </text>
                  </g>
                )
              )}
            </svg>

            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
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
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Todavía no hay suficientes
            movimientos para mostrar la
            evolución.
          </p>
        )}
      </section>
    </main>
  );
}
