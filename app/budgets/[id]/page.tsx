export default async function EditBudgetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="p-6">
      <h1>Editar presupuesto</h1>
      <p>ID: {id}</p>
    </main>
  );
}
