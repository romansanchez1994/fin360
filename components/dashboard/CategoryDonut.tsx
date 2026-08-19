"use client";

import {
  PieChart,
  Pie,
  Cell,
  //ResponsiveContainer,
} from "recharts";

type CategoryData = {
  name: string;
  total: number;
};

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#a855f7",
];

export default function CategoryDonut({
  data,
}: {
  data: CategoryData[];
}) {
  const total = data.reduce(
    (sum, item) => sum + item.total,
    0
  );
  
  return (
    <div className="border rounded-3xl p-5 mb-6">
      <h2 className="font-semibold mb-4">
        Gastos por categoría
      </h2>
    <div className="relative flex justify-center mb-6">
      <PieChart width={320} height={320}>
        <Pie
          data={data}
          dataKey="total"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={
                COLORS[index % COLORS.length]
              }
            />
          ))}
        </Pie>
      </PieChart>
      <div
        className="
          absolute
          inset-0
          flex
          flex-col
          items-center
          justify-center
          pointer-events-none
        "
      >
        <span className="text-2xl font-bold">
          {total.toFixed(2)} €
        </span>
      
        <span className="text-sm text-gray-400">
          Total
        </span>
        </div>
      </div>
    </div>
  );
}
