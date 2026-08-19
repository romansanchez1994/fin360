"use client";

type Category = {
  id: number;
  name: string;
};

export default function Filters({
  categories,
}: {
  categories: Category[];
}) {
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

          {categories.map((cat) => (
            <option key={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}
