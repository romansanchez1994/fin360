"use client";

import { useState } from "react";
import { createExpense } from "./actions";

export default function CategoryForm({
  categories,
  subcategories,
}: {
  categories: any[];
  subcategories: any[];
}) {
  const [selectedCategory, setSelectedCategory] =
    useState("");

  const filteredSubcategories =
    subcategories.filter(
      (subcategory) =>
        String(subcategory.category_id) ===
        selectedCategory
    );

  return (
    <form
        action={createExpense}
        className="space-y-4">
      <div>
        <label className="block mb-1">
          Importe
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
          placeholder="Mercadona"
          className="w-full border rounded-lg p-3"
          required
        />
      </div>

      {filteredSubcategories.length > 0 && (
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
              required
            >
              <option value="">
                Selecciona una categoría
              </option>
    
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>
      )}
      <div>
        <label className="block mb-1">
          Subcategoría
        </label>

        <select
          name="subcategory_id"
          className="w-full border rounded-lg p-3"
        >
          <option value="">
            Selecciona una subcategoría
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
        Guardar gasto
      </button>
    </form>
  );
}
