import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { outfit } from "@/lib/fonts";

export default async function KandidatProfilPage({ params }) {
  const { id } = await params;

  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect("/login");
  }

  if (sessionUser.role !== "firma") {
    redirect("/");
  }

  const [rows] = await db.query(
    "SELECT id, ime, email, role, linkedin_url FROM users WHERE id = ?",
    [id]
  );

  const kandidat = rows[0];

  if (!kandidat) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] px-6 py-20 text-[#0b1220]">
        <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <h1 className={`${outfit.className} text-2xl font-extrabold`}>
            KANDIDAT NIJE PRONAĐEN
          </h1>
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

  // Ljepši naziv uloge za prikaz
  const uloga = kandidat.role === "osoba" ? "Kandidat" : kandidat.role;

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
            Profil kandidata
          </p>

          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#1a75ff] to-[#5ea8ff] text-4xl font-bold text-white shadow-lg shadow-[#1a75ff]/30">
              {kandidat.ime?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className={`${outfit.className} text-3xl font-extrabold uppercase tracking-tight md:text-4xl`}>
                {kandidat.ime}
              </h1>
              <p className="mt-1 text-gray-600">{kandidat.email}</p>
              <span className="mt-3 inline-block rounded-full bg-[#1a75ff] px-3 py-1 text-xs font-semibold text-white">
                {uloga}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SADRŽAJ ================= */}
      <div className="mx-auto grid max-w-5xl gap-6 px-6 py-10 lg:grid-cols-3">
        {/* LIJEVO: podaci */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-2">
          <h2 className={`${outfit.className} mb-6 text-2xl font-extrabold`}>
            PODACI O KANDIDATU
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-[#f5f7fa] p-5">
              <p className="mb-1 text-sm text-gray-500">Ime</p>
              <p className="text-lg font-semibold">{kandidat.ime}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#f5f7fa] p-5">
              <p className="mb-1 text-sm text-gray-500">Email</p>
              <p className="break-all text-lg font-semibold">{kandidat.email}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#f5f7fa] p-5 md:col-span-2">
              <p className="mb-1 text-sm text-gray-500">Uloga</p>
              <p className="text-lg font-semibold">{uloga}</p>
            </div>
          </div>
        </div>

        {/* DESNO: kontakt */}
        <div>
          <div className="rounded-3xl bg-[#0b1220] p-8 text-white shadow-xl lg:sticky lg:top-24">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#5ea8ff]">
              Kontakt
            </p>
            <h3 className={`${outfit.className} mb-3 text-2xl font-extrabold`}>
              STUPI U KONTAKT
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Pogledaj LinkedIn profil kandidata ili mu pošalji email.
            </p>

            <div className="space-y-3">
              {kandidat.linkedin_url ? (
                <a
                  href={kandidat.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-[#1a75ff] px-5 py-3.5 text-center font-semibold text-white shadow-lg shadow-[#1a75ff]/30 transition hover:-translate-y-0.5 hover:bg-[#0f5fd6]"
                >
                  Otvori LinkedIn profil
                </a>
              ) : (
                <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
                  Kandidat nije dodao LinkedIn profil.
                </p>
              )}

              <a
                href={`mailto:${kandidat.email}`}
                className="block rounded-2xl border border-white/20 px-5 py-3.5 text-center font-semibold text-white transition hover:border-[#5ea8ff] hover:text-[#5ea8ff]"
              >
                Pošalji email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}