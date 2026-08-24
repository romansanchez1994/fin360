import Filters from "./Filters";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import DeleteButton from "@/components/DeleteButton";
import { deleteExpense } from "../expenses/deleteExpense";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export default async function InformesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    subcategory?: string;
    sort?: string;
  }>;
}) {
  const { data: expenses } = await supabase
    .from("expenses")
    .select(`
      *,
      categories (
        name
      ),
      subcategories (
        name
      )
    `)
    .eq("household_id", HOUSEHOLD_ID);

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const { data: subcategories } = await supabase
    .from("subcategories")
    .select("*")
    .order("name");

  const params = await searchParams;

  const search =
    params.search?.toLowerCase() ?? "";

  const category =
    params.category ?? "";

  const subcategory =
    params.subcategory ?? "";

  const sort =
    params.sort ?? "recentes";
  
  const selectedCategoryId =
    categories?.find(
      (cat) => cat.name === category
    )?.id;

  const filteredSubcategories =
    subcategories?.filter(
      (subcat) =>
        subcat.category_id === selectedCategoryId
    ) ?? [];

  const gastos =
    expenses
      ?.filter((gasto) => {
        const matchesSearch =
          gasto.description
            ?.toLowerCase()
            .includes(search);

        const matchesCategory =
          !category ||
          gasto.categories?.name === category;

        const matchesSubcategory =
          !subcategory ||
          gasto.subcategories?.name ===
            subcategory;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesSubcategory
        );
      })
      .sort((a, b) => {

        if (sort === "antiguos") {
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );
        }
      
        if (sort === "mayor") {
          return (
            Number(b.amount) -
            Number(a.amount)
          );
        }
      
        if (sort === "menor") {
          return (
            Number(a.amount) -
            Number(b.amount)
          );
        }
      
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
      
      }) ?? [];


  return (
    <main className="p-6 max-w-md mx-auto">
      <Link
        href="/"
        className="text-blue-400"
        >
        ← Dashboard
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-6">
        Informe de gastos
      </h1>
      <Filters 
        categories={categories ?? []}
        subcategories={filteredSubcategories}
        selectedCategory={category}
        selectedSubcategory={subcategory}
        search={search}
        sort={sort}
      />
      <form className="mb-6">
        
      </form>

      <div className="space-y-3">
        {(gastos ?? []).map((gasto, index) => (
          <div
            key={gasto.id}
            className={`p-4 rounded-2xl ${
              index % 2 === 0
                ? "bg-zinc-900"
                : "bg-zinc-800"
            }`}
          >
            <div className="text-xs text-gray-400">
              {new Date(
                gasto.date
              ).toLocaleDateString("es-ES")}
            </div>

            <div className="flex justify-between mt-1">
              <div>
                <div className="font-medium text-white">
                  {gasto.description}
                </div>

                <div className="text-sm text-gray-400">
                  {gasto.categories?.name}
                  {gasto.subcategories?.name
                    ? ` · ${gasto.subcategories.name}`
                    : ""}
                </div>
                <div>
                  <Link
                    href={`/expenses/${gasto.id}/edit`}
                    className="text-blue-400 text-sm"
                    >
                    ✏️ Editar
                  </Link>
                  <form
                    className="inline"
                    action={deleteExpense.bind(
                      null,
                      gasto.id
                    )}>
                    <DeleteButton />
                  </form>
                </div>
              </div>

              <span className="font-semibold text-white">
                {Number(gasto.amount).toFixed(2)} €
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
