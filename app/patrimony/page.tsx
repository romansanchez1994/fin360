import { supabase } from "@/lib/supabase/client";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export default async function PatrimonyPage() {
  const { data: profile } =
    await supabase
      .from("financial_profile")
      .select("*")
      .eq(
        "household_id",
        HOUSEHOLD_ID
      )
      .single();

  const { data: incomes } =
    await supabase
      .from("incomes")
      .select("*");

  const { data: expenses } =
    await supabase
      .from("expenses")
      .select("*");

  const { data: contributions } =
    await supabase
      .from("goal_contributions")
      .select("*");

  const initialLiquidity =
    Number(
      profile?.initial_liquidity ?? 0
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
    (contributions ?? []).reduce(
      (total, contribution) =>
        total +
        Number(
          contribution.amount
        ),
      0
    );

  const availableLiquidity =
    initialLiquidity +
    accumulatedBalance -
    fundedGoals;

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        🏦 Patrimonio
      </h1>

      <div className="space-y-4">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-gray-400">
            Liquidez inicial
          </div>

          <div className="text-2xl font-semibold">
            {initialLiquidity.toFixed(2)} €
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-gray-400">
            Balance acumulado
          </div>

          <div className="text-2xl font-semibold">
        
