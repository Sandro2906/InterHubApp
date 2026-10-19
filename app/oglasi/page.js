import { FilterOglasa } from "@/components/FilterOglasa";
import Kartica from "@/components/Kartica";
import React from "react";
import db from "@/lib/db";
import { outfit } from "@/lib/fonts";

export default async function Oglas({ searchParams }) {
  const params = await searchParams;

  const search = params.search || "";
  const grad = params.grad || "";

  let query = "SELECT * FROM oglas WHERE 1=1";
  let values = [];

  if (search) {
    query += " AND (Pozicija LIKE ? OR Firma LIKE ?)";
    values.push(`%${search}%`, `%${search}%`);
  }

  if (grad) {
    query += " AND Lokacija = ?";
    values.push(grad);
  }

  query += " ORDER BY Datum DESC";

  const [oglasi] = await db.query(query, values);

  return (
    <div className="min-h-screen bg-white text-[#0b1220]">
      {/* ================= PRETRAGA (plavkasto u bijelo) ================= */}
      <div className="bg-gradient-to-b from-[#eaf2ff] to-white">
        <FilterOglasa initialSearch={search} initialGrad={grad} />
      </div>

      {/* ================= OGLASI (sivo) ================= */}
      <div className="border-t border-gray-200 bg-[#f5f7fa]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 pb-8 pt-12">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-[#1a75ff]">
              Rezultati
            </p>
            <h2 className={`${outfit.className} text-2xl font-extrabold tracking-tight md:text-3xl`}>
              DOSTUPNI OGLASI
            </h2>
          </div>

          <span className="rounded-full bg-[#1a75ff] px-4 py-1.5 text-sm font-semibold text-white">
            {oglasi.length} {oglasi.length === 1 ? "oglas" : "oglasa"}
          </span>
        </div>

        {oglasi.length > 0 ? (
          <Kartica oglasi={oglasi} />
        ) : (
          <div className="mx-auto max-w-7xl px-6 pb-16">
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-lg font-semibold">Nema oglasa za ovu pretragu</p>
              <p className="mt-2 text-gray-500">
                Probaj drugi pojam ili izaberi "Svi gradovi".
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}