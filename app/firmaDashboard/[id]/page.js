import Link from "next/link";
import db from "@/lib/db";
import { updateOglas, deleteOglas } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { outfit } from "@/lib/fonts";

// Iste klase za sva polja i labele
const inputClass =
  "w-full rounded-2xl border border-gray-300 bg-[#f5f7fa] px-4 py-3 text-[#0b1220] outline-none transition focus:border-[#1a75ff] focus:bg-white focus:ring-4 focus:ring-[#1a75ff]/10";

const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

export default async function OglasDetaljiPage({ params }) {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "firma") {
    redirect("/");
  }

  const [oglasi] = await db.query(
    "SELECT * FROM oglas WHERE OglasID = ? AND user_id = ?",
    [id, user.id]
  );

  const oglas = oglasi[0];

  const [questions] = await db.query(
    "SELECT pitanje FROM oglas_pitanje WHERE oglas_id = ? ORDER BY pozicija",
    [id]
  );

  const [prijave] = await db.query(
    `
    SELECT
      users.id,
      users.ime,
      users.email,
      users.phone,
      users.linkedin_url,
      prijave.datum_prijave,
      COALESCE(scores.score, 0) AS score
    FROM prijave
    JOIN users ON prijave.user_id = users.id
    LEFT JOIN (
      SELECT prijava_id, ROUND(AVG(vrijednost) / 10 * 100, 2) AS score
      FROM prijava_odgovor
      GROUP BY prijava_id
    ) AS scores ON scores.prijava_id = prijave.id
    WHERE prijave.oglas_id = ?
    ORDER BY score DESC, prijave.datum_prijave DESC
    `,
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
            Oglas ne postoji ili nemaš pristup njemu.
          </p>
          <Link
            href="/firmaDashboard"
            className="mt-6 inline-block rounded-2xl bg-[#1a75ff] px-6 py-3 font-semibold text-white transition hover:bg-[#0f5fd6]"
          >
            Nazad na dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#0b1220]">
      {/* ================= ZAGLAVLJE ================= */}
      <div className="border-b border-gray-200 bg-gradient-to-b from-[#eaf2ff] to-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link
            href="/firmaDashboard"
            className="text-sm font-semibold text-[#1a75ff] transition hover:underline"
          >
            ← Nazad na dashboard
          </Link>

          <p className="mb-1 mt-6 text-sm font-semibold uppercase tracking-widest text-[#1a75ff]">
            Detalji oglasa
          </p>
          <h1 className={`${outfit.className} text-3xl font-extrabold uppercase tracking-tight md:text-4xl`}>
            {oglas.Pozicija}
          </h1>
          <p className="mt-2 text-gray-600">
            {oglas.Firma} • {oglas.Lokacija}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        {/* ================= FORMA ZA IZMJENU ================= */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className={`${outfit.className} mb-6 text-2xl font-extrabold`}>
            UREDI OGLAS
          </h2>

          <form action={updateOglas} className="grid gap-5 md:grid-cols-2">
            <input type="hidden" name="id" value={oglas.OglasID} />

            <div>
              <label className={labelClass}>Pozicija</label>
              <input type="text" name="pozicija" defaultValue={oglas.Pozicija} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Firma</label>
              <input type="text" name="firma" defaultValue={oglas.Firma} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Lokacija</label>
              <input type="text" name="lokacija" defaultValue={oglas.Lokacija} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Tip</label>
              <input type="text" name="tip" defaultValue={oglas.Tip} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Iskustvo</label>
              <input type="text" name="iskustvo" defaultValue={oglas.Iskustvo} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Plata (KM)</label>
              <input type="number" step="0.01" name="plata" defaultValue={oglas.Plata} className={inputClass} />
            </div>

            {/* Pitanja */}
            <div className="grid gap-5 border-t border-gray-100 pt-6 md:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#1a75ff]">
                Pitanja za kandidate
              </p>

              <div>
                <label className={labelClass}>Pitanje 1</label>
                <input type="text" name="question1" defaultValue={questions[0]?.pitanje || ""} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Pitanje 2</label>
                <input type="text" name="question2" defaultValue={questions[1]?.pitanje || ""} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Pitanje 3</label>
                <input type="text" name="question3" defaultValue={questions[2]?.pitanje || ""} className={inputClass} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Datum</label>
              <input
                type="date"
                name="datum"
                defaultValue={new Date(oglas.Datum).toISOString().split("T")[0]}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="cursor-pointer rounded-2xl bg-[#1a75ff] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#1a75ff]/30 transition hover:-translate-y-0.5 hover:bg-[#0f5fd6]"
              >
                Sačuvaj izmjene
              </button>
            </div>
          </form>

          {/* Brisanje */}
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-red-700">Brisanje oglasa</p>
              <p className="text-sm text-red-600/80">
                Oglas i sve prijave na njega biće trajno obrisani.
              </p>
            </div>

            <form action={deleteOglas}>
              <input type="hidden" name="id" value={oglas.OglasID} />
              <button
                type="submit"
                className="cursor-pointer rounded-2xl border border-red-300 bg-white px-6 py-3 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
              >
                Obriši oglas
              </button>
            </form>
          </div>
        </div>

        {/* ================= KANDIDATI ================= */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className={`${outfit.className} text-2xl font-extrabold`}>
              PRIJAVLJENI KANDIDATI
            </h2>
            <span className="rounded-full bg-[#1a75ff] px-4 py-1.5 text-sm font-semibold text-white">
              {prijave.length}
            </span>
          </div>

          {prijave.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-[#f5f7fa] p-10 text-center text-gray-500">
              Nema prijavljenih kandidata.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b border-gray-200 bg-[#f5f7fa] text-sm uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Ime</th>
                    <th className="px-5 py-4 font-semibold">Email</th>
                    <th className="px-5 py-4 font-semibold">Telefon</th>
                    <th className="px-5 py-4 font-semibold">Rezultat</th>
                    <th className="px-5 py-4 font-semibold">Datum prijave</th>
                    <th className="px-5 py-4 font-semibold">Akcije</th>
                  </tr>
                </thead>

                <tbody>
                  {prijave.map((kandidat) => (
                    <tr
                      key={kandidat.id}
                      className="border-b border-gray-100 text-sm transition last:border-0 hover:bg-[#eaf2ff]/50"
                    >
                      <td className="px-5 py-4 font-semibold">{kandidat.ime}</td>
                      <td className="px-5 py-4 text-gray-600">{kandidat.email}</td>
                      <td className="px-5 py-4 text-gray-600">{kandidat.phone || "Nema"}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#eaf2ff] px-3 py-1 font-semibold text-[#1a75ff]">
                          {typeof kandidat.score === "number"
                            ? kandidat.score.toFixed(2)
                            : Number(kandidat.score || 0).toFixed(2)}
                          %
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {new Date(kandidat.datum_prijave).toLocaleDateString("sr-RS")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/profil/${kandidat.id}`}
                            className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-[#0b1220] transition hover:border-[#1a75ff] hover:text-[#1a75ff]"
                          >
                            Profil
                          </Link>

                          {kandidat.linkedin_url && (
                            <a
                              href={kandidat.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl bg-[#1a75ff] px-4 py-2 font-semibold text-white transition hover:bg-[#0f5fd6]"
                            >
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}