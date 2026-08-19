"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
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
  return (
    <div className="border rounded-3xl p-5 mb-6">
      <h2 className="font-semibold mb-4">
        Gastos por categoría
      </h2>

      <div className="h-64 mb-6">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {data.map((categoria) => (
          <div
            key={categoria.name}
            className="
              flex
              justify-between
              items-center
            "
          >
            <span>
              {categoria.name}
            </span>

            <span className="font-semibold">
              {categoria.total.toFixed(2)} €
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
