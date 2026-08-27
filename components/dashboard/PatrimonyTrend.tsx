"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PatrimonyPoint = {
  label: string;
  value: number;
};

type PatrimonyTrendProps = {
  data: PatrimonyPoint[];
  compact?: boolean;
};

const currencyFormatter =
  new Intl.NumberFormat(
    "es-ES",
    {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }
  );

export default function PatrimonyTrend({
  data,
  compact = false,
}: PatrimonyTrendProps) {
  if (data.length < 2) {
    return (
      <p className="text-sm text-gray-400">
        Todavía no hay suficientes movimientos
        para mostrar la evolución.
      </p>
    );
  }

  return (
    <div className={
      compact
        ? "w-full h-44"
        : "w-full h-64"
    }>
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 5,
            left: 5,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="patrimonyGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#34d399"
                stopOpacity={0.35}
              />

              <stop
                offset="95%"
                stopColor="#34d399"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#3f3f46"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            stroke="#a1a1aa"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />

          <YAxis
            stroke="#a1a1aa"
            tickLine={false}
            axisLine={false}
            width={58}
            fontSize={11}
            tickFormatter={(value) =>
              `${Math.round(
                Number(value) / 1000
              )}k`
            }
          />

          <Tooltip
            cursor={{
              stroke: "#34d399",
              strokeDasharray: "4 4",
            }}
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "12px",
              color: "#ffffff",
            }}
            labelStyle={{
              color: "#a1a1aa",
            }}
            formatter={(value) => [
              currencyFormatter.format(
                Number(value)
              ),
              "Patrimonio",
            ]}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#34d399"
            strokeWidth={3}
            fill="url(#patrimonyGradient)"
            activeDot={{
              r: 6,
              fill: "#34d399",
              stroke: "#09090b",
              strokeWidth: 3,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
