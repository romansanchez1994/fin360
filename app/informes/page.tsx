import Link from "next/link";

export default function InformesPage() {
  return (
    <main className="p-6 max-w-md mx-auto">
      <Link
        href="/"
        className="text-blue-400"
      >
        ← Dashboard
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-6">
        Informe de Gastos
      </h1>
    </main>
  );
}
