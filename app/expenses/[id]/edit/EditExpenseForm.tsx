"use client";
import { useState } from "react";

export default function EditExpenseForm({
  expense,
  categories,
  subcategories,
  action,
}: {
  expense: any;
  categories: any[];
  subcategories: any[];
  action: (formData: FormData) => Promise<void>;
}) {
  const [selectedCategory, setSelectedCategory] =
    useState(
      String(expense?.category_id ?? "")
  );
  const filteredSubcategories =
    subcategories.filter(
      (subcategory) =>
        String(subcategory.category_id) ===
        selectedCategory
  );
  return (
    <form
      action={action}
      className="space-y-4"
    >

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
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
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

          {filteredSubcategories.map(
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg"
        >
          Guardar cambios
        </button>
    
    </form>
  );
}
