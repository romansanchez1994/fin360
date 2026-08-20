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
  const [isRecurring, setIsRecurring] =
    useState(false);
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
      <div className="flex items-center gap-3">
        <input
          id="is_recurring"
          type="checkbox"
          name="is_recurring"
          checked={isRecurring}
          onChange={(e) =>
            setIsRecurring(e.target.checked)
          }
        />
      
        <label htmlFor="is_recurring">
          Gasto recurrente
        </label>
      </div>
      {isRecurring && (
        <>
          <div>
            <label className="block mb-1">
              Frecuencia
            </label>
      
            <select
              name="frecuencia"
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
              Fecha fin (opcional)
            </label>
      
            <input
              name="fecha_fin"
              type="date"
              className="w-full border rounded-lg p-3"
            />
          </div>
        </>
      )}

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

      
      {filteredSubcategories.length > 0 && (
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
      )}
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg"
      >
        Guardar gasto
      </button>
    </form>
  );
}
