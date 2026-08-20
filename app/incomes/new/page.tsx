import { createIncome } from "./actions";

export default function NewIncomePage() {
  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Nuevo ingreso
      </h1>

      <form
        action={createIncome}
        className="space-y-4"
      >
        <input
          </label>

          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Descripción
          </label>

          <input
            name="description"
            type="text"
            placeholder="Nómina"
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Fecha
          </label>

          <input
            name="date"
            type="date"
            defaultValue={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg"
        >
          Guardar ingreso
        </button>
      </form>
    </main>
  );
}
