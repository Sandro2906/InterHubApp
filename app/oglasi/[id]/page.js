import db from "@/lib/db";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { applyToJob } from "@/lib/actions";

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
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold">Oglas nije pronađen.</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/oglasi" className="text-cyan-400 hover:underline">
          ← Nazad na oglase
        </Link>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h1 className="mb-4 text-3xl font-bold">{oglas.Pozicija}</h1>

          <div className="mb-6 grid gap-3 text-slate-300 md:grid-cols-2">
            <p><span className="font-semibold text-white">Firma:</span> {oglas.Firma}</p>
            <p><span className="font-semibold text-white">Lokacija:</span> {oglas.Lokacija}</p>
            <p><span className="font-semibold text-white">Tip:</span> {oglas.Tip}</p>
            <p><span className="font-semibold text-white">Iskustvo:</span> {oglas.Iskustvo}</p>
            <p><span className="font-semibold text-white">Plata:</span> {oglas.Plata} KM</p>
            <p>
              <span className="font-semibold text-white">Datum:</span>{" "}
              {new Date(oglas.Datum).toLocaleDateString("sr-RS")}
            </p>
          </div>

          {oglas.OpisPosla && (
            <div className="mb-8">
              <h2 className="mb-2 text-xl font-semibold">Opis posla</h2>
              <p className="leading-7 text-slate-300">{oglas.OpisPosla}</p>
            </div>
          )}

          {questions.length > 0 && (
            <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">Pitanja za prijavu</h2>
              <div className="grid gap-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="rounded-xl border border-slate-700 bg-slate-950/30 p-4">
                    <p className="text-slate-200">
                      <span className="font-semibold text-white">Pitanje {index + 1}:</span> {question.pitanje}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!user && (
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p className="text-slate-300">
                Moraš biti prijavljen da bi aplicirao.
              </p>
              <Link
                href="/login"
                className="mt-3 inline-block rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-white hover:bg-cyan-400"
              >
                Login
              </Link>
            </div>
          )}

          {user?.role === "firma" && (
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p className="text-slate-300">
                Firma ne može aplicirati na oglas.
              </p>
            </div>
          )}

          {user?.role === "osoba" && (
            <div className="space-y-4">
              {questions.length < 3 ? (
                <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                  <p className="text-slate-300">
                    Oglas nema dovoljno pitanja za prijavu. Firma mora postaviti barem 3 pitanja.
                  </p>
                </div>
              ) : (
                <form action={applyToJob} className="space-y-4">
                  <input type="hidden" name="oglasId" value={oglas.OglasID} />

                  <div className="grid gap-4">
                    {questions.map((question) => (
                      <div key={question.id}>
                        <label className="mb-2 block text-sm text-slate-300">
                          {question.pitanje}
                        </label>
                        <input
                          name={`answer_${question.id}`}
                          type="number"
                          min="1"
                          max="10"
                          required
                          placeholder="Ocijeni 1-10"
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Poruka firmi
                    </label>
                    <textarea
                      name="poruka"
                      rows="5"
                      placeholder="Napiši kratku poruku firmi..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-400"
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
  );
}