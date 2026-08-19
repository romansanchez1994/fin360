"use client";

import {
  PieChart,
  //Pie,
  //Cell,
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
  return (
    <div className="border rounded-3xl p-5 mb-6">
      TEST RECHARTS
    </div>
  );
}
