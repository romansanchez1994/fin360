import { createHash } from "crypto";

type CategorySummary = {
  name: string;
  amount: number;
  percentage: number;
};

type BudgetSummary = {
  category: string;
  budgetAmount: number;
  spentAmount: number;
  usagePercentage: number;
};

type GoalSummary = {
  name: string;
  targetAmount: number;
  fundedAmount: number;
  progressPercentage: number;
};

type MonthSummary = {
  month: number;
  year: number;
  income: number;
  expenses: number;
  balance: number;
};

type PatrimonySummary = {
  totalPatrimony: number;
  availableLiquidity: number;
  fundedGoals: number;
  accumulatedBalance: number;
};

export type MonthlyFinancialContextInput = {
  householdId: string;

  month: number;
  year: number;
  monthLabel: string;

  income: number;
  expenses: number;
  balance: number;
  savingsRate: number;

  previousMonth?: MonthSummary | null;

  historicalMonths?: MonthSummary[];

  categories: CategorySummary[];

  budgets?: BudgetSummary[];

  goals?: GoalSummary[];

  patrimony?: PatrimonySummary | null;
};

export type MonthlyFinancialContext = {
  period: {
    month: number;
    year: number;
    label: string;
    periodStart: string;
  };

  currentMonth: {
    income: number;
    expenses: number;
    balance: number;
    savingsRate: number;
  };

  previousMonth: {
    available: boolean;
    income: number | null;
    expenses: number | null;
    balance: number | null;

    incomeDifference: number | null;
    expenseDifference: number | null;
    balanceDifference: number | null;
  };

  historicalComparison: {
    available: boolean;
    monthsIncluded: number;

    averageIncome: number | null;
    averageExpenses: number | null;
    averageBalance: number | null;

    expenseDifferenceFromAverage:
      number | null;

    expensePercentageFromAverage:
      number | null;
  };

  categories: {
    name: string;
    amount: number;
    percentage: number;
  }[];

  budgets: {
    available: boolean;
    count: number;
    items: BudgetSummary[];
  };

  goals: {
    available: boolean;
    count: number;
    items: GoalSummary[];
  };

  patrimony: {
    available: boolean;
    totalPatrimony: number | null;
    availableLiquidity: number | null;
    fundedGoals: number | null;
    accumulatedBalance: number | null;
  };

  dataAvailability: {
    hasPreviousMonth: boolean;
    hasHistoricalAverage: boolean;
    hasBudgets: boolean;
    hasGoals: boolean;
    hasPatrimony: boolean;
  };
};

function roundCurrency(
  value: number
) {
  return Number(
    value.toFixed(2)
  );
}

function roundPercentage(
  value: number
) {
  return Number(
    value.toFixed(1)
  );
}

function average(
  values: number[]
) {
  if (values.length === 0) {
    return null;
  }

  return (
    values.reduce(
      (total, value) =>
        total + value,
      0
    ) / values.length
  );
}

export function buildMonthlyFinancialContext(
  input: MonthlyFinancialContextInput
): MonthlyFinancialContext {
  const previousMonth =
    input.previousMonth ?? null;

  const historicalMonths =
    input.historicalMonths ?? [];

  const budgets =
    input.budgets ?? [];

  const goals =
    input.goals ?? [];

  const hasPreviousMonth =
    previousMonth !== null;

  /*
   * Exigimos al menos dos meses anteriores
   * para hablar de una media histórica.
   *
   * Con un único mes anterior podemos hacer
   * comparativa, pero no afirmar que existe
   * una tendencia consolidada.
   */

  const hasHistoricalAverage =
    historicalMonths.length >= 2;

  const averageIncome =
    hasHistoricalAverage
      ? average(
          historicalMonths.map(
            (month) =>
              Number(month.income)
          )
        )
      : null;

  const averageExpenses =
    hasHistoricalAverage
      ? average(
          historicalMonths.map(
            (month) =>
              Number(month.expenses)
          )
        )
      : null;

  const averageBalance =
    hasHistoricalAverage
      ? average(
          historicalMonths.map(
            (month) =>
              Number(month.balance)
          )
        )
      : null;

  const expenseDifferenceFromAverage =
    averageExpenses !== null
      ? input.expenses -
        averageExpenses
      : null;

  const expensePercentageFromAverage =
    averageExpenses !== null &&
    averageExpenses > 0
      ? (
          (
            input.expenses -
            averageExpenses
          ) /
          averageExpenses
        ) * 100
      : null;

  const periodStart =
    `${input.year}-` +
    `${String(
      input.month + 1
    ).padStart(2, "0")}-01`;

  return {
    period: {
      month: input.month,
      year: input.year,
      label: input.monthLabel,
      periodStart,
    },

    currentMonth: {
      income:
        roundCurrency(
          input.income
        ),

      expenses:
        roundCurrency(
          input.expenses
        ),

      balance:
        roundCurrency(
          input.balance
        ),

      savingsRate:
        roundPercentage(
          input.savingsRate
        ),
    },

    previousMonth: {
      available:
        hasPreviousMonth,

      income:
        previousMonth
          ? roundCurrency(
              previousMonth.income
            )
          : null,

      expenses:
        previousMonth
          ? roundCurrency(
              previousMonth.expenses
            )
          : null,

      balance:
        previousMonth
          ? roundCurrency(
              previousMonth.balance
            )
          : null,

      incomeDifference:
        previousMonth
          ? roundCurrency(
              input.income -
              previousMonth.income
            )
          : null,

      expenseDifference:
        previousMonth
          ? roundCurrency(
              input.expenses -
              previousMonth.expenses
            )
          : null,

      balanceDifference:
        previousMonth
          ? roundCurrency(
              input.balance -
              previousMonth.balance
            )
          : null,
    },

    historicalComparison: {
      available:
        hasHistoricalAverage,

      monthsIncluded:
        historicalMonths.length,

      averageIncome:
        averageIncome !== null
          ? roundCurrency(
              averageIncome
            )
          : null,

      averageExpenses:
        averageExpenses !== null
          ? roundCurrency(
              averageExpenses
            )
          : null,

      averageBalance:
        averageBalance !== null
          ? roundCurrency(
              averageBalance
            )
          : null,

      expenseDifferenceFromAverage:
        expenseDifferenceFromAverage !==
        null
          ? roundCurrency(
              expenseDifferenceFromAverage
            )
          : null,

      expensePercentageFromAverage:
        expensePercentageFromAverage !==
        null
          ? roundPercentage(
              expensePercentageFromAverage
            )
          : null,
    },

    categories:
      input.categories
        .map((category) => ({
          name:
            category.name,

          amount:
            roundCurrency(
              category.amount
            ),

          percentage:
            roundPercentage(
              category.percentage
            ),
        }))
        .sort(
          (a, b) =>
            b.amount -
            a.amount
        ),

    budgets: {
      available:
        budgets.length > 0,

      count:
        budgets.length,

      items:
        budgets.map(
          (budget) => ({
            category:
              budget.category,

            budgetAmount:
              roundCurrency(
                budget.budgetAmount
              ),

            spentAmount:
              roundCurrency(
                budget.spentAmount
              ),

            usagePercentage:
              roundPercentage(
                budget.usagePercentage
              ),
          })
        ),
    },

    goals: {
      available:
        goals.length > 0,

      count:
        goals.length,

      items:
        goals.map(
          (goal) => ({
            name:
              goal.name,

            targetAmount:
              roundCurrency(
                goal.targetAmount
              ),

            fundedAmount:
              roundCurrency(
                goal.fundedAmount
              ),

            progressPercentage:
              roundPercentage(
                goal.progressPercentage
              ),
          })
        ),
    },

    patrimony: {
      available:
        input.patrimony !==
        undefined &&
        input.patrimony !==
        null,

      totalPatrimony:
        input.patrimony
          ? roundCurrency(
              input.patrimony
                .totalPatrimony
            )
          : null,

      availableLiquidity:
        input.patrimony
          ? roundCurrency(
              input.patrimony
                .availableLiquidity
            )
          : null,

      fundedGoals:
        input.patrimony
          ? roundCurrency(
              input.patrimony
                .fundedGoals
            )
          : null,

      accumulatedBalance:
        input.patrimony
          ? roundCurrency(
              input.patrimony
                .accumulatedBalance
            )
          : null,
    },

    dataAvailability: {
      hasPreviousMonth,
      hasHistoricalAverage,

      hasBudgets:
        budgets.length > 0,

      hasGoals:
        goals.length > 0,

      hasPatrimony:
        input.patrimony !==
          undefined &&
        input.patrimony !==
          null,
    },
  };
}

export function buildMonthlyContextHash(
  context: MonthlyFinancialContext
) {
  return createHash("sha256")
    .update(
      JSON.stringify(context)
    )
    .digest("hex");
}
