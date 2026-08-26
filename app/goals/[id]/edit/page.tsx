import Link from "next/link";
import { updateGoal } from "../../updateGoal";
import { supabase } from "@/lib/supabase/client";

export default async function EditGoalPage({
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }) {
  const { id } = await params;

  const { data: goal } =
    await supabase
      .from("financial_goals")
      .select("*")
      .eq("id", id)
      .single();
  return (
    <main className="p-6 max-w-md mx-auto">
      <div className="mb-6">
        <Link href="/goals">
          ← Volver a objetivos
        </Link>
      </div>

      <form 
        action={createGoal}
        className="space-y-4">
          <input
              type="hidden"
              name="id"
              value={goal?.id}
            />
        <div>
          <label
            htmlFor="name"
            className="block text-sm text-gray-400 mb-2"
          >
            Nombre del objetivo
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={goal?.name}
            className="
              w-full
              rounded-xl
              border
              border-gray-700
              bg-zinc-900
              px-4
              py-3
              text-white
              outline-none
              focus:border-blue-500
            "
          />
        </div>

        <div>
          <label
            htmlFor="goalType"
            className="block text-sm text-gray-400 mb-2"
          >
            Tipo de objetivo
          </label>

          <select
            id="goalType"
            name="goalType"
            required
            defaultValue={goal?.goal_type}
            className="
              w-full
              rounded-xl
              border
              border-gray-700
              bg-zinc-900
              px-4
              py-3
              text-white
              outline-none
              focus:border-blue-500
            "
          >
            <option value="emergency_fund">
              Fondo de emergencia
            </option>

            <option value="savings">
              Ahorro
            </option>

            <option value="home">
              Vivienda
            </option>

            <option value="travel">
              Viaje
            </option>

            <option value="car">
              Coche
            </option>

            <option value="investment">
              Inversión
            </option>

            <option value="other">
              Otro
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="targetAmount"
            className="block text-sm text-gray-400 mb-2"
          >
            Importe objetivo
          </label>

          <input
            id="targetAmount"
            name="targetAmount"
            type="number"
            required
            min="0.01"
            step="0.01"
            defaultValue={goal?.target_amount}
            className="
              w-full
              rounded-xl
              border
              border-gray-700
              bg-zinc-900
              px-4
              py-3
              text-white
              outline-none
              focus:border-blue-500
            "
          />
        </div>
        
        <div>
          <label
            htmlFor="targetDate"
            className="block text-sm text-gray-400 mb-2"
          >
            Fecha objetivo
            <span className="text-gray-600">
              {" "}(opcional)
            </span>
          </label>

          <input
            id="targetDate"
            name="targetDate"
            type="date"
            defaultValue={goal?.target_date}
            className="
              w-full
              rounded-xl
              border
              border-gray-700
              bg-zinc-900
              px-4
              py-3
              text-white
              outline-none
              focus:border-blue-500
            "
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm text-gray-400 mb-2"
          >
            Descripción
            <span className="text-gray-600">
              {" "}(opcional)
            </span>
          </label>

          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={goal?.description}
            className="
              w-full
              resize-none
              rounded-xl
              border
              border-gray-700
              bg-zinc-900
              px-4
              py-3
              text-white
              outline-none
              focus:border-blue-500
            "
          />
        </div>

        <button
          type="submit"
          className="
            w-full
            rounded-xl
            bg-blue-600
            px-4
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-500
          "
        >
          Guardar Cambios
        </button>
      </form>
    </main>
  );
}
