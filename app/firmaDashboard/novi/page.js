import Link from "next/link";
import { createOglas } from "@/lib/actions";
import { outfit } from "@/lib/fonts";

// Iste klase za sva polja i labele
const inputClass =
  "w-full rounded-2xl border border-gray-300 bg-[#f5f7fa] px-4 py-3 text-[#0b1220] placeholder:text-gray-400 outline-none transition focus:border-[#1a75ff] focus:bg-white focus:ring-4 focus:ring-[#1a75ff]/10";

const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

export default function NoviOglasPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#0b1220]">
      {/* ================= ZAGLAVLJE ================= */}
      <div className="border-b border-gray-200 bg-gradient-to-b from-[#eaf2ff] to-white">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Link
            href="/firmaDashboard"
            className="text-sm font-semibold text-[#1a75ff] transition hover:underline"
          >
            ← Nazad na dashboard
          </Link>

          <p className="mb-1 mt-6 text-sm font-semibold uppercase tracking-widest text-[#1a75ff]">
            Novi oglas
          </p>
          <h1 className={`${outfit.className} text-3xl font-extrabold tracking-tight md:text-4xl`}>
            DODAJ NOVI OGLAS
          </h1>
          <p className="mt-2 text-gray-600">
            Popuni podatke o poziciji i dodaj pitanja na koja kandidati odgovaraju
            prilikom prijave.
          </p>
        </div>
      </div>

      {/* ================= FORMA ================= */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        <form
          action={createOglas}
          className="grid gap-5 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:grid-cols-2"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#1a75ff] md:col-span-2">
            Osnovni podaci
          </p>

          <div>
            <label className={labelClass}>Pozicija</label>
            <input name="pozicija" placeholder="npr. Junior Frontend Developer" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Firma</label>
            <input name="firma" placeholder="Naziv firme" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Lokacija</label>
            <input name="lokacija" placeholder="npr. Banja Luka ili Remote" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Tip</label>
            <input name="tip" placeholder="npr. Praksa, Full-time" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Iskustvo</label>
            <input name="iskustvo" placeholder="npr. Bez iskustva" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Plata (KM)</label>
            <input name="plata" type="number" step="0.01" placeholder="Ostavi prazno za dogovor" className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Datum objave</label>
            <input name="datum" type="date" className={inputClass} />
          </div>

          {/* Pitanja */}
          <div className="grid gap-5 border-t border-gray-100 pt-6 md:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#1a75ff]">
              Pitanja za kandidate
            </p>

            <div>
              <label className={labelClass}>Pitanje 1</label>
              <input name="question1" placeholder="npr. Koliko dobro poznaješ React?" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Pitanje 2</label>
              <input name="question2" placeholder="Pitanje 2" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Pitanje 3</label>
              <input name="question3" placeholder="Pitanje 3" className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row md:col-span-2">
            <button
              type="submit"
              className="cursor-pointer rounded-2xl bg-[#1a75ff] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#1a75ff]/30 transition hover:-translate-y-0.5 hover:bg-[#0f5fd6]"
            >
              Dodaj oglas
            </button>

            <Link
              href="/firmaDashboard"
              className="rounded-2xl border border-gray-300 bg-white px-7 py-3.5 text-center font-semibold text-[#0b1220] transition hover:border-[#1a75ff] hover:text-[#1a75ff]"
            >
              Odustani
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}