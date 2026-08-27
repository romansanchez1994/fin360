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
  const currencyFormatter =
    new Intl.NumberFormat(
      "es-ES",
      {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }
    );
  return (
    <div className="w-full h-44 my-4">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={trendData}
          margin={{
            top: 10,
            right: 5,
            left: 5,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="expenseGradient"
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
            stroke="#ffffff22"
            strokeDasharray="4 4"
            vertical={false}
          />
  
          <XAxis
            dataKey="day"
            stroke="#ffffff88"
            tickLine={false}
            axisLine={false}
            fontSize={11}
          />
  
          <YAxis
            stroke="#ffffff88"
            tickLine={false}
            axisLine={false}
            width={50}
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
              backgroundColor:
                "#111827",
              border:
                "1px solid #34d399",
              borderRadius: "12px",
              color: "#ffffff",
            }}
            formatter={(value) => [
              currencyFormatter.format(
                Number(value)
              ),
              "Balance",
            ]}
            labelFormatter={(label) =>
              `Día ${label}`
            }
          />
  
          <Area
            type="monotone"
            dataKey="total"
            stroke="#34d399"
            strokeWidth={3}
            fill="url(#expenseGradient)"
            activeDot={{
              r: 6,
              fill: "#34d399",
              stroke: "#0f172a",
              strokeWidth: 3,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
