import { supabase } from "@/lib/supabase/client";

export default async function EditBudgetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: budget } = await supabase
    .from("budgets")
    .select("*")
    .eq("id", id)
    .single();

  return (
    <main className="p-6">
      <h1>Editar presupuesto</h1>

      <pre>
        {JSON.stringify(budget, null, 2)}
      </pre>
    </main>
  );
}
`
