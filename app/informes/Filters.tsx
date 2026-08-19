"use client";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

type Subcategory = {
  id: string
  name: string
};

export default function Filters({
  categories,
  subcategories,
  selectedCategory,
  selectedSubcategory,
  search,
  sort,
}: {
  categories: Category[];
  subcategories: Subcategory[];
  selectedCategory: string;
  selectedSubcategory: string;
  search: string;
  sort: string;
}) {
  const [searchText, setSearchText] =
    useState(search);
    /*useEffect(() => {
      const timeout = setTimeout(() => {
        const form =
          document.getElementById(
            "filters-form"
          ) as HTMLFormElement | null;
    
        form?.requestSubmit();
      }, 500);
    
      return () => clearTimeout(timeout);
    }, [searchText]);*/
  return (
    <div className="mb-6">
      <p className="mb-2 text-gray-400">
        Filtros
      </p>

      <form id="filters-form">
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
          <option value="">
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
        {subcategories.length > 0 && (
          <select
            name="subcategory"
            defaultValue={selectedSubcategory}
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
            <option value="">
              Todas las subcategorías
            </option>
        
            {subcategories.map((subcat) => (
              <option
                key={subcat.id}
                value={subcat.name}
              >
                {subcat.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="search"
          name="search"
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
          placeholder="Buscar gasto..."
          className="
            w-full
            p-3
            rounded-xl
            border
            border-gray-300
            bg-zinc-900
            text-white
            placeholder:text-gray-500
          "
        />
        
      </form>
    </div>
  );
}
