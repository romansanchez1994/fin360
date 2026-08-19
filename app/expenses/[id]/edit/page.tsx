import { supabase } from "@/lib/supabase/client";
import { updateExpense } from "./actions";
import EditExpenseForm from "./EditExpenseForm";

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

      <EditExpenseForm
        expense={expense}
        categories={categories ?? []}
        subcategories={subcategories ?? []}
      />
      
    </main>
  );
}
