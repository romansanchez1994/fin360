"use client";

type Expense = {
  amount: number;
  date: string;
};

export default function ExpenseTrend({
  expenses,
}: {
  expenses: Expense[];
}) {
  return (
    <div className="my-6 text-white/60">
      Gastos recibidos: {expenses.length}
    </div>
  );
}
