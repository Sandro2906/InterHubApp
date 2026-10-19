import db from "@/lib/db";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { applyToJob } from "@/lib/actions";
import { outfit } from "@/lib/fonts";

// Iste klase za polja i labele
const inputClass =
  "w-full rounded-2xl border border-gray-300 bg-[#f5f7fa] px-4 py-3 text-[#0b1220] placeholder:text-gray-400 outline-none transition focus:border-[#1a75ff] focus:bg-white focus:ring-4 focus:ring-[#1a75ff]/10";

const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

export default async function OglasDetaljiPublicPage({ params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  const [rows] = await db.query("SELECT * FROM oglas WHERE OglasID = ?", [id]);
  const oglas = rows[0];

  const [questions] = await db.query(
    "SELECT id, pitanje FROM oglas_pitanje WHERE oglas_id = ? ORDER BY pozicija",
    [id]
  );

  if (!oglas) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] px-6 py-20 text-[#0b1220]">
        <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <h1 className={`${outfit.className} text-2xl font-extrabold`}>
            OGLAS NIJE PRONAĐEN
          </h1>
          <p className="mt-2 text-gray-500">
            Oglas je možda uklonjen ili link nije ispravan.
          </p>
          <Link
            href="/oglasi"
            className="mt-6 inline-block rounded-2xl bg-[#1a75ff] px-6 py-3 font-semibold text-white transition hover:bg-[#0f5fd6]"
          >
            Nazad na oglase
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#0b1220]">
      {/* ================= ZAGLAVLJE ================= */}
      <div className="border-b border-gray-200 bg-gradient-to-b from-[#eaf2ff] to-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link
            href="/oglasi"
            className="text-sm font-semibold text-[#1a75ff] transition hover:underline"
          >
            ← Nazad na oglase
          </Link>

          <span className="mt-6 block w-fit rounded-full bg-[#1a75ff] px-3 py-1 text-xs font-semibold text-white">
            {oglas.Tip}
          </span>

          <h1 className={`${outfit.className} mt-4 text-3xl font-extrabold uppercase tracking-tight md:text-5xl`}>
            {oglas.Pozicija}
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            {oglas.Firma} • {oglas.Lokacija}
          </p>
        </div>
      </div>

      {/* ================= SADRŽAJ ================= */}
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-3">
        {/* LIJEVO: informacije o oglasu */}
        <div className="space-y-8 lg:col-span-2">
          {/* Osnovni podaci */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Firma</p>
              <p className="mt-1 font-semibold">{oglas.Firma}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Lokacija</p>
              <p className="mt-1 font-semibold">{oglas.Lokacija}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Tip</p>
              <p className="mt-1 font-semibold">{oglas.Tip}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Iskustvo</p>
              <p className="mt-1 font-semibold">{oglas.Iskustvo}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Plata</p>
              <p className="mt-1 font-semibold text-[#1a75ff]">
                {oglas.Plata ? `${oglas.Plata} KM` : "Po dogovoru"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Datum objave</p>
              <p className="mt-1 font-semibold">
                {new Date(oglas.Datum).toLocaleDateString("sr-RS")}
              </p>
            </div>
          </div>

          {/* Opis posla */}
          {oglas.OpisPosla && (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className={`${outfit.className} mb-4 text-2xl font-extrabold`}>
                OPIS POSLA
              </h2>
              <p className="leading-7 text-gray-700">{oglas.OpisPosla}</p>
            </div>
          )}

          {/* Pitanja */}
          {questions.length > 0 && (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className={`${outfit.className} mb-2 text-2xl font-extrabold`}>
                PITANJA ZA PRIJAVU
              </h2>
              <p className="mb-6 text-gray-600">
                Prilikom prijave ocjenjuješ svoje znanje od 1 do 10 za svako
                pitanje.
              </p>

              <div className="grid gap-3">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-[#f5f7fa] p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a75ff] text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-gray-700">{question.pitanje}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DESNO: prijava */}
        <div>
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm lg:sticky lg:top-24">
            <h2 className={`${outfit.className} mb-4 text-2xl font-extrabold`}>
              PRIJAVA
            </h2>

            {!user && (
              <div>
                <p className="text-gray-600">
                  Moraš biti prijavljen da bi aplicirao na ovaj oglas.
                </p>
                <Link
                  href="/login"
                  className="mt-5 block rounded-2xl bg-[#1a75ff] px-6 py-3 text-center font-semibold text-white shadow-lg shadow-[#1a75ff]/30 transition hover:bg-[#0f5fd6]"
                >
                  Login
                </Link>
              </div>
            )}

            {user?.role === "firma" && (
              <div className="rounded-2xl border border-gray-200 bg-[#f5f7fa] p-4 text-gray-600">
                Firma ne može aplicirati na oglas.
              </div>
            )}

            {user?.role === "osoba" && (
              <div>
                {questions.length < 3 ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                    Oglas nema dovoljno pitanja za prijavu. Firma mora postaviti
                    barem 3 pitanja.
                  </div>
                ) : (
                  <form action={applyToJob} className="space-y-5">
                    <input type="hidden" name="oglasId" value={oglas.OglasID} />

                    {questions.map((question, index) => (
                      <div key={question.id}>
                        <label className={labelClass}>
                          {index + 1}. {question.pitanje}
                        </label>
                        <input
                          name={`answer_${question.id}`}
                          type="number"
                          min="1"
                          max="10"
                          required
                          placeholder="Ocijeni 1-10"
                          className={inputClass}
                        />
                      </div>
                    ))}

                    <div>
                      <label className={labelClass}>Poruka firmi</label>
                      <textarea
                        name="poruka"
                        rows="5"
                        placeholder="Napiši kratku poruku firmi..."
                        className={inputClass}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full cursor-pointer rounded-2xl bg-[#1a75ff] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#1a75ff]/30 transition hover:-translate-y-0.5 hover:bg-[#0f5fd6]"
                    >
                      Apliciraj
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}