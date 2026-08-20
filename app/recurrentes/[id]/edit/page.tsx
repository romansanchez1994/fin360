import { supabase } from "@/lib/supabase/client";
import { updateRecurrente } from "./actions";

export default async function EditRecurrentePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: recurrente } = await supabase
    .from("gastos_recurrentes")
    .select("*")
    .eq("id", id)
    .single();

  const updateRecurrenteWithId =
    updateRecurrente.bind(null, id);

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Editar recurrente
      </h1>

      <form
        action={updateRecurrenteWithId}
        className="space-y-4"
   
            Nombre
          </label>

          <input
            name="nombre"
            type="text"
            defaultValue={recurrente?.nombre}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Importe
          </label>

          <input
            name="importe"
            type="number"
            step="0.01"
            defaultValue={recurrente?.importe}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Frecuencia
          </label>

          <select
            name="frecuencia"
            defaultValue={recurrente?.frecuencia}
            className="w-full border rounded-lg p-3"
          >
            <option value="mensual">
              Mensual
            </option>

            <option value="trimestral">
              Trimestral
            </option>

            <option value="anual">
              Anual
            </option>
          </select>
        </div>

        <div>
          <label className="block mb-1">
            Fecha inicio
          </label>

          <input
            name="fecha_inicio"
            type="date"
            defaultValue={recurrente?.fecha_inicio}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1">
            Fecha fin
          </label>

          <input
            name="fecha_fin"
            type="date"
            defaultValue={recurrente?.fecha_fin ?? ""}
            className="w-full border rounded-lg p-3"
          />
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
