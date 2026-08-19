"use client";

export default function DeleteButton() {
  return (
    <button
      type="submit"
      className="text-red-400 text-sm"
      onClick={(e) => {
        if (
          !window.confirm(
            "¿Seguro que quieres eliminar este gasto?"
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      🗑 Eliminar
    </button>
  );
}
