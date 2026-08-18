import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

const HOUSEHOLD_ID =
  "dbecda94-3798-4425-9616-74a6c08cd2c2";

export default async function InformesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    subcategory?: string;
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
  <p className="text-white">
    Categorías cargadas: {categories?.length ?? 0}
  </p>

  const { data: subcategories } = await supabase
    .from("subcategories")
    .select("*")
    .order("name");
  
  const params = await searchParams;
  
  const category =
    Number(params.category) || 0;
  const subcategory =
    params.subcategory ?? "";
  const filteredSubcategories =
    subcategories?.filter(
      (subcat) =>
        subcat.category_id === category
      ) ?? [];

  const search =
    params.search?.toLowerCase() ?? "";
  
  const gastos =
    expenses
      ?.filter((gasto) => {
  
        const matchesSearch =
          gasto.description
            ?.toLowerCase()
            .includes(search);
  
        const matchesCategory =
          !category ||
          gasto.category_id === category;
  
        return (
          matchesSearch &&
          matchesCategory
        );
  
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      ) ?? [];

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
      
      <form className="mb-6">
        <select
          name="category"
          defaultValue={category}
          className="
            w-full
            p-3
            rounded-xl
            border
            border-gray-300
            bg-zinc-900
            text-white
            mb-3"
        >
          <option value="">
            Todas las categorias
          </option>
            {(categories ?? []).map((cat) => (
              <option
                key={cat.id}
                value={cat.name}
              >
                {cat.name}
              </option>
        ))}
        </select>
      
        <input
          type="search"
          name="search"
          placeholder="Buscar gasto..."
          className="
            w-full
            p-3
            rounded-xl
            border
            border-gray-300
            bg-zinc-900
            text-white
            placeholder:text-gray-500
          "
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Buscar
        </button>
      </form>

      <div className="space-y-3">
        {gastos.map((gasto, index) => (
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

