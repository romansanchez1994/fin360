import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import DeleteButton from "@/components/DeleteButton";
import { deleteGoal } from "./deleteGoal";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export default async function GoalsPage() {
  const { data: goals } =
    await supabase
      .from("financial_goals")
      .select("*")
      .eq(
        "household_id",
        HOUSEHOLD_ID
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );
  const { data: contributions } =
    await supabase
      .from("goal_contributions")
      .select("*");
  
  return (
    <main className="p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          🎯 Objetivos financieros
        </h1>

        <Link href="/goals/new">
          Nuevo
        </Link>
      </div>

      {(goals ?? []).length === 0 && (
        <div className="border rounded-xl p-6 text-center">
          <p className="text-gray-400">
            Todavía no tienes objetivos.
          </p>

          <Link href="/goals/new">
            Crear primer objetivo →
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {(goals ?? []).map(
          (goal) => {
            const totalSaved =
              (contributions ?? [])
                .filter(
                  (contribution) =>
                    contribution.goal_id ===
                    goal.id
                )
                .reduce(
                  (total, contribution) =>
                    total +
                    Number(
                      contribution.amount
                    ),
                  0
                );
        
            const percentage =
              Number(goal.target_amount) > 0
                ? (totalSaved /
                    Number(
                      goal.target_amount
                    )) *
                  100
                : 0;
        
            return (
            <div
              key={goal.id}
              className="
                border
                rounded-xl
                p-4
              "
            >
              <h2 className="font-semibold">
                {goal.name}
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                {totalSaved.toFixed(2)} € de{" "}
                {Number(
                  goal.target_amount
                ).toFixed(2)}
                €
              </p>

              <div className="w-full bg-gray-800 rounded-full h-3 mt-4">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{
                    width: `${Math.min(
                      percentage,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {percentage.toFixed(0)}%
              </p>
              <div className="flex items-center gap-6 mt-4">
                <Link href={`/goals/${goal.id}/edit`}>
                  ✏️ Editar
                </Link>
                <form
                  className="inline-flex"
                  action={deleteGoal.bind(
                    null,
                    budget.id
                  )}
                >
                  <DeleteButton />
                </form>
              </div>
            </div>
          );
          }
        )}
      </div>
    </main>
  );
}
