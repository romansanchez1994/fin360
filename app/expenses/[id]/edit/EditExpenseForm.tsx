"use client";

export default function EditExpenseForm({
  expense,
  categories,
  subcategories,
}: {
  expense: any;
  categories: any[];
  subcategories: any[];
}) {
  return (
    <div className="space-y-4">

      <div>
        <label className="block mb-1">
          Descripción
        </label>

        <input
          name="description"
          type="text"
          defaultValue={expense?.description}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-1">
          Importe
        </label>

        <input
          name="amount"
          type="number"
          step="0.01"
          defaultValue={expense?.amount}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-1">
          Fecha
        </label>

        <input
          name="date"
          type="date"
          defaultValue={expense?.date}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-1">
          Categoría
        </label>

        <select
          name="category_id"
          defaultValue={expense?.category_id}
          className="w-full border rounded-lg p-3"
        >
          {categories?.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">
          Subcategoría
        </label>

        <select
          name="subcategory_id"
          defaultValue={
            expense?.subcategory_id ?? ""
          }
          className="w-full border rounded-lg p-3"
        >
          <option value="">
            Sin subcategoría
          </option>

          {subcategories?.map(
            (subcategory) => (
              <option
                key={subcategory.id}
                value={subcategory.id}
              >
                {subcategory.name}
              </option>
            )
          )}
        </select>
      </div>

    </div>
  );
}
