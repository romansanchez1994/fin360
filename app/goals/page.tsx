import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

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
          (goal) => (
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
                {Number(
                  goal.target_amount
                ).toFixed(2)}
                €
              </p>

              <div className="w-full bg-gray-800 rounded-full h-3 mt-4">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{
                    width: "0%",
                  }}
                />
              </div>

              <p className="text-xs text-gray-400 mt-2">
                0%
              </p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
