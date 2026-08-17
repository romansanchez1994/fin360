import { supabase } from "@/lib/supabase/client";
import { createExpense } from "./actions";
import CategoryForm from "./CategoryForm";
import Link from "next/link";

export default async function NewExpensePage() {
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");
  
  const { data: subcategories } = await supabase
    .from("subcategories")
    .select("*")
    .order("name");

  return (
    <main className="max-w-md mx-auto p-6">
      <Link
        href="/"
        className="text-blue-600 mb-4 inline-block">
        ← Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-6">
        Nuevo gasto
      </h1>

      <CategoryForm
        categories={categories ?? []}
        subcategories={subcategories ?? []}
      />
    </main>
  );
}
