"use client";

export default function Filters() {
  return (
    <div className="mb-6">
      <p className="mb-2 text-gray-400">
        Filtros
      </p>

      <form>
        <select
          className="
            w-full
            p-3
            rounded-xl
            border
            border-gray-300
            bg-zinc-900
            text-white
            mb-3
          "
        >
          <option>
            Todas las categorías
          </option>
        </select>
      </form>
    </div>
  );
}
