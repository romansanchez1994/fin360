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
  const trendData = expenses
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      )
      .map((expense, index, array) => ({
        day:
          new Date(expense.date).getDate(),
        total: array
          .slice(0, index + 1)
          .reduce(
            (sum, item) =>
              sum + Number(item.amount),
            0
          ),
      }));

  return (
    <div className="my-6 text-white/60 text-sm">
      {JSON.stringify(
        trendData.slice(0, 5),
        null,
        2
      )}
    </div>
  );
}
