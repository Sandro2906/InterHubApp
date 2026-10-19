import Link from "next/link";

export default function Kartica({ oglasi }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 md:grid-cols-2 xl:grid-cols-3">
      {oglasi.map((data) => (
        <div
          key={data.OglasID}
          className="group flex flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#1a75ff]/40 hover:shadow-xl hover:shadow-[#1a75ff]/10"
        >
          <span className="mb-4 w-fit rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-semibold text-[#1a75ff]">
            {data.Tip}
          </span>

          <h3 className="text-xl font-bold text-[#0b1220] transition group-hover:text-[#1a75ff]">
            {data.Pozicija}
          </h3>

          <p className="mt-2 text-gray-600">
            {data.Firma} • {data.Lokacija}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-gray-200 bg-[#f5f7fa] px-3 py-1 text-gray-700">
              {data.Iskustvo}
            </span>

            <span className="rounded-full border border-gray-200 bg-[#f5f7fa] px-3 py-1 text-gray-700">
              {data.Plata ? `${data.Plata} KM` : "Po dogovoru"}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 text-sm mt-6">
            <div>
              <p className="text-gray-500">Datum objave</p>
              <p className="font-medium text-[#0b1220]">
                {new Date(data.Datum).toLocaleDateString("sr-RS")}
              </p>
            </div>

            <Link
              href={`/oglasi/${data.OglasID}`}
              className="rounded-2xl bg-[#1a75ff] px-5 py-2.5 font-semibold text-white shadow-md shadow-[#1a75ff]/30 transition hover:bg-[#0f5fd6]"
            >
              Detalji
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}