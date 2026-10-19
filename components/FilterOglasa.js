"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function FilterOglasa({ initialSearch = "", initialGrad = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [grad, setGrad] = useState(initialGrad);

  function handlePretraga() {
    const params = new URLSearchParams(searchParams.toString());

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    if (grad) {
      params.set("grad", grad);
    } else {
      params.delete("grad");
    }

    router.push(`/oglasi?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-[#0b1220]">
          Pretraga oglasa
        </h1>

        {/* Filteri: Search i Grad */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Pretraži poziciju ili firmu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 bg-[#f5f7fa] px-4 py-3 text-[#0b1220] placeholder:text-gray-400 outline-none transition focus:border-[#1a75ff] focus:bg-white focus:ring-4 focus:ring-[#1a75ff]/10"
          />

          <select
            value={grad}
            onChange={(e) => setGrad(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 bg-[#f5f7fa] px-4 py-3 text-[#0b1220] outline-none transition focus:border-[#1a75ff] focus:bg-white focus:ring-4 focus:ring-[#1a75ff]/10"
          >
            <option value="">Svi gradovi</option>
            <option value="Banja Luka">Banja Luka</option>
            <option value="Sarajevo">Sarajevo</option>
            <option value="Tuzla">Tuzla</option>
            <option value="Mostar">Mostar</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="mt-6">
          <button
            onClick={handlePretraga}
            className="cursor-pointer rounded-2xl bg-[#1a75ff] px-6 py-3 font-semibold text-white shadow-lg shadow-[#1a75ff]/30 transition hover:scale-105 hover:bg-[#0f5fd6]"
          >
            Pretraži
          </button>
        </div>
      </div>
    </div>
  );
}