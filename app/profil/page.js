import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateLinkedin } from "@/lib/actions";
import { outfit } from "@/lib/fonts";

export default async function ProfilPage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect("/login");
  }

  if (sessionUser.role === "firma") {
    redirect("/firmaDashboard");
  }

  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
    sessionUser.id,
  ]);

  const user = rows[0];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] px-6 py-20 text-[#0b1220]">
        <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <h1 className={`${outfit.className} text-2xl font-extrabold`}>
            KORISNIK NIJE PRONAĐEN
          </h1>
          <p className="mt-2 text-gray-500">Korisnik ne postoji u bazi.</p>
        </div>
      </div>
    );
  }

  // Ljepši naziv uloge za prikaz
  const uloga = user.role === "osoba" ? "Kandidat" : user.role;

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#0b1220]">
      {/* ================= ZAGLAVLJE ================= */}
      <div className="border-b border-gray-200 bg-gradient-to-b from-[#eaf2ff] to-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-[#1a75ff]">
            Moj profil
          </p>

          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#1a75ff] to-[#5ea8ff] text-4xl font-bold text-white shadow-lg shadow-[#1a75ff]/30">
              {user.ime?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className={`${outfit.className} text-3xl font-extrabold uppercase tracking-tight md:text-4xl`}>
                {user.ime}
              </h1>
              <p className="mt-1 text-gray-600">{user.email}</p>
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
            LIČNI PODACI
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-[#f5f7fa] p-5">
              <p className="mb-1 text-sm text-gray-500">Ime</p>
              <p className="text-lg font-semibold">{user.ime}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#f5f7fa] p-5">
              <p className="mb-1 text-sm text-gray-500">Email</p>
              <p className="break-all text-lg font-semibold">{user.email}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#f5f7fa] p-5">
              <p className="mb-1 text-sm text-gray-500">Uloga</p>
              <p className="text-lg font-semibold">{uloga}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#f5f7fa] p-5">
              <p className="mb-1 text-sm text-gray-500">LinkedIn</p>
              {user.linkedin_url ? (
                <a
                  href={user.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-lg font-semibold text-[#1a75ff] hover:underline"
                >
                  Otvori profil
                </a>
              ) : (
                <p className="text-lg font-semibold text-gray-400">Nije dodat</p>
              )}
            </div>
          </div>
        </div>

        {/* DESNO: LinkedIn forma */}
        <div>
          <div className="rounded-3xl bg-[#0b1220] p-8 text-white shadow-xl lg:sticky lg:top-24">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#5ea8ff]">
              Povećaj šanse
            </p>
            <h3 className={`${outfit.className} mb-3 text-2xl font-extrabold`}>
              LINKEDIN PROFIL
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Dodaj ili promijeni link svog LinkedIn profila, da firme lakše
              vide tvoje iskustvo.
            </p>

            <form action={updateLinkedin} className="space-y-4">
              <input
                type="url"
                name="linkedin_url"
                defaultValue={user.linkedin_url || ""}
                placeholder="https://www.linkedin.com/in/..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-[#5ea8ff] focus:ring-4 focus:ring-[#1a75ff]/20"
              />

              <button
                type="submit"
                className="w-full cursor-pointer rounded-2xl bg-[#1a75ff] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#1a75ff]/30 transition hover:-translate-y-0.5 hover:bg-[#0f5fd6]"
              >
                Sačuvaj LinkedIn
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}