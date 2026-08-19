"use client";

type CategoryData = {
  name: string;
  total: number;
};

export default function CategoryDonut({
  data,
}: {
  data: CategoryData[];
}) {
  return (
    <div className="border rounded-3xl p-5 mb-6">
      <h2 className="font-semibold mb-4">
        Gastos por categoría
      </h2>

      <div className="text-center py-10">
        DONUT AQUÍ
      </div>

      <div className="space-y-3">
        {data.map((categoria) => (
          <div
            key={categoria.name}
            className="
              flex
              justify-between
              items-center
            "
          >
            <span>
              {categoria.name}
            </span>

            <span className="font-semibold">
              {categoria.total.toFixed(2)} €
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
