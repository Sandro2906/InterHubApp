import Link from "next/link";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { outfit } from "@/lib/fonts";

export default async function FirmaDashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "firma") redirect("/");

  const [oglasi] = await db.query(
    "SELECT * FROM oglas WHERE user_id = ? ORDER BY Datum DESC",
    [user.id]
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#0b1220]">
      {/* ================= ZAGLAVLJE (plavkasto u bijelo) ================= */}
      <div className="border-b border-gray-200 bg-gradient-to-b from-[#eaf2ff] to-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-[#1a75ff]">
              Firma Dashboard
            </p>
            <h1 className={`${outfit.className} text-3xl font-extrabold tracking-tight md:text-4xl`}>
              TVOJI OGLASI
            </h1>
            <p className="mt-2 text-gray-600">
              Ukupno objavljenih oglasa:{" "}
              <span className="font-semibold text-[#1a75ff]">{oglasi.length}</span>
            </p>
          </div>

          <Link
            href="/firmaDashboard/novi"
            className="w-fit rounded-2xl bg-[#1a75ff] px-6 py-3 font-semibold text-white shadow-lg shadow-[#1a75ff]/30 transition hover:-translate-y-0.5 hover:bg-[#0f5fd6]"
          >
            + Dodaj oglas
          </Link>
        </div>
      </div>

      {/* ================= TABELA (sivo) ================= */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left">
            <thead className="border-b border-gray-200 bg-[#f5f7fa] text-sm uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Pozicija</th>
                <th className="px-6 py-4 font-semibold">Lokacija</th>
                <th className="px-6 py-4 font-semibold">Tip</th>
                <th className="px-6 py-4 font-semibold">Datum</th>
                <th className="px-6 py-4 font-semibold">Akcije</th>
              </tr>
            </thead>

            <tbody>
              {oglasi.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Još nemaš objavljenih oglasa.
                  </td>
                </tr>
              )}

              {oglasi.map((oglas) => (
                <tr
                  key={oglas.OglasID}
                  className="border-b border-gray-100 transition last:border-0 hover:bg-[#eaf2ff]/50"
                >
                  <td className="px-6 py-4 font-semibold">{oglas.Pozicija}</td>
                  <td className="px-6 py-4 text-gray-600">{oglas.Lokacija}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-semibold text-[#1a75ff]">
                      {oglas.Tip}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(oglas.Datum).toLocaleDateString("sr-RS")}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/firmaDashboard/${oglas.OglasID}`}
                      className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-[#0b1220] transition hover:border-[#1a75ff] hover:text-[#1a75ff]"
                    >
                      Detalji
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}