import Link from "next/link";
import db from "@/lib/db";
import { updateOglas, deleteOglas } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

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
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold">Oglas nije pronađen.</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <Link
            href="/firmaDashboard"
            className="text-cyan-400 transition hover:underline"
          >
            ← Nazad na dashboard
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="mb-6 text-3xl font-bold">Detalji oglasa</h1>

          <form action={updateOglas} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="id" value={oglas.OglasID} />

            <div>
              <label className="mb-2 block text-sm text-slate-300">Pozicija</label>
              <input
                type="text"
                name="pozicija"
                defaultValue={oglas.Pozicija}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Firma</label>
              <input
                type="text"
                name="firma"
                defaultValue={oglas.Firma}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Lokacija</label>
              <input
                type="text"
                name="lokacija"
                defaultValue={oglas.Lokacija}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Tip</label>
              <input
                type="text"
                name="tip"
                defaultValue={oglas.Tip}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Iskustvo</label>
              <input
                type="text"
                name="iskustvo"
                defaultValue={oglas.Iskustvo}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Plata</label>
              <input
                type="number"
                step="0.01"
                name="plata"
                defaultValue={oglas.Plata}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="md:col-span-2 grid gap-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Pitanje 1</label>
                <input
                  type="text"
                  name="question1"
                  defaultValue={questions[0]?.pitanje || ""}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Pitanje 2</label>
                <input
                  type="text"
                  name="question2"
                  defaultValue={questions[1]?.pitanje || ""}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Pitanje 3</label>
                <input
                  type="text"
                  name="question3"
                  defaultValue={questions[2]?.pitanje || ""}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">Datum</label>
              <input
                type="date"
                name="datum"
                defaultValue={new Date(oglas.Datum).toISOString().split("T")[0]}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="mt-4 flex gap-4 md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-400"
              >
                Sačuvaj izmjene
              </button>
            </div>
          </form>

          <form action={deleteOglas} className="mt-4">
            <input type="hidden" name="id" value={oglas.OglasID} />
            <button
              type="submit"
              className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-400"
            >
              Obriši oglas
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-6 text-2xl font-bold">Prijavljeni kandidati</h2>

          {prijave.length === 0 ? (
            <p className="text-slate-400">Nema prijavljenih kandidata.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full text-left">
                <thead className="border-b border-slate-800 bg-slate-800/50 text-sm text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Ime</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Telefon</th>
                    <th className="px-4 py-3">Rezultat (%)</th>
                    <th className="px-4 py-3">Datum prijave</th>
                    <th className="px-4 py-3">Akcije</th>
                  </tr>
                </thead>

                <tbody>
                  {prijave.map((kandidat) => (
                    <tr
                      key={kandidat.id}
                      className="border-b border-slate-800 text-sm text-slate-200"
                    >
                      <td className="px-4 py-3">{kandidat.ime}</td>
                      <td className="px-4 py-3">{kandidat.email}</td>
                      <td className="px-4 py-3">{kandidat.phone || "Nema"}</td>
                      <td className="px-4 py-3">{typeof kandidat.score === "number" ? kandidat.score.toFixed(2) : Number(kandidat.score || 0).toFixed(2)}%</td>
                      <td className="px-4 py-3">
                        {new Date(kandidat.datum_prijave).toLocaleDateString("sr-RS")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <Link
                            href={`/profil/${kandidat.id}`}
                            className="rounded-xl bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-600"
                          >
                            Profil
                          </Link>

                          {kandidat.linkedin_url && (
                            <a
                              href={kandidat.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl bg-cyan-500 px-4 py-2 text-white transition hover:bg-cyan-400"
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