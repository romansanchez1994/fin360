import { supabase } from "@/lib/supabase/client";
import { updateExpense } from "./actions";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const { data: expense } = await supabase
        .from("expenses")
        .select("*")
        .eq("id", id)
        .single();
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");
    
    const { data: subcategories } = await supabase
      .from("subcategories")
      .select("*")
      .order("name");
    const updateExpenseWithId =
        updateExpense.bind(null, id);
        
  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Editar gasto
      </h1>

      <form action={updateExpenseWithId} className="space-y-4">
        <div>
            <label className="block mb-1">
                Descripción
            </label>

            <input
                name="description"
                type="text"
                defaultValue={expense?.description}
                className="w-full border rounded-lg p-3"
            />
        </div>

        <div>
            <label className="block mb-1">
                Importe
            </label>

            <input
                name="amount"
                type="number"
                step="0.01"
                defaultValue={expense?.amount}
                className="w-full border rounded-lg p-3"
            />
        </div>
        <div>
          <label className="block mb-1">
              Fecha
          </label>
      
          <input
              name="date"
              type="date"
              defaultValue={expense?.date}
              className="w-full border rounded-lg p-3"
          />
        </div>
        <div>
          <label className="block mb-1">
              Categoría
          </label>
      
          <select
              name="category_id"
              defaultValue={expense?.category_id}
              className="w-full border rounded-lg p-3"
          >
              {categories?.map((category) => (
                  <option
                      key={category.id}
                      value={category.id}
                  >
                      {category.name}
                  </option>
              ))}
          </select>
        </div>
        <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
            >
            Guardar cambios
        </button>
        </form>
    </main>
  );
}
