"use client";

type Category = {
  id: string;
  name: string;
};

export default function Filters({
  categories,
  subcategories,
  selectedCategory,
  selectedSubcategory,
}: {
  categories: Category[];
  subcategories: Subcategory[];
  selectedCategory: string;
  selectedSubcategory: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-gray-400">
        Filtros
      </p>

      <form>
        <select
          name="category"
          defaultValue={selectedCategory}
          onChange={(e) =>
            e.currentTarget.form?.requestSubmit()
          }
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
            <option 
              key={cat.id}
              value={cat.name}
            >
              {cat.name}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}
