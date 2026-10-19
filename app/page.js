import React from "react";
import Link from "next/link";
import db from "@/lib/db";
import VantaDots from "@/components/VantaDots";
import { outfit } from "@/lib/fonts";
import { getCurrentUser } from "@/lib/auth";

export default async function Homee() {
  async function getData() {
    const [rows] = await db.query(`
      SELECT * 
      FROM oglas 
      ORDER BY Datum DESC 
      LIMIT 3
    `);
    return rows;
  }

  const data = await getData();
  const user = await getCurrentUser();

  // Firma ide na formu za novi oglas, svi ostali na login
  const objaviHref = user?.role === "firma" ? "/firmaDashboard/novi" : "/login";

  // Prijavljeni kandidat ide na profil, ostali na registraciju
  const kandidatHref = user?.role === "osoba" ? "/profil" : "/register";

  return (
    <div className="min-h-screen bg-white text-[#0b1220]">
      {/* ================= HERO ================= */}
      <div className="relative overflow-hidden">
        {/* Vanta tačkice */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <VantaDots />
        </div>

        {/* Prelaz u sivo na dnu */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-b from-transparent to-[#f5f7fa]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-28 pt-20">
          <section className="grid items-center gap-12 lg:grid-cols-2">
            {/* LIJEVO: kartice jedna ispod druge */}
            <div className="space-y-4 lg:order-1">
              <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur transition hover:translate-x-1 hover:border-[#1a75ff]/40 hover:shadow-xl hover:shadow-[#1a75ff]/10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf2ff] font-mono text-sm font-bold text-[#1a75ff]">
                  &lt;/&gt;
                </div>
                <div>
                  <h3 className="text-lg font-bold">Frontend</h3>
                  <p className="text-sm text-gray-600">
                    React, Next.js, Tailwind, TypeScript
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur transition hover:translate-x-1 hover:border-[#1a75ff]/40 hover:shadow-xl hover:shadow-[#1a75ff]/10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf2ff] font-mono text-sm font-bold text-[#1a75ff]">
                  {"{ }"}
                </div>
                <div>
                  <h3 className="text-lg font-bold">Backend</h3>
                  <p className="text-sm text-gray-600">
                    Node.js, Express, SQL, API integracije
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur transition hover:translate-x-1 hover:border-[#1a75ff]/40 hover:shadow-xl hover:shadow-[#1a75ff]/10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf2ff] font-mono text-sm font-bold text-[#1a75ff]">
                  ✦
                </div>
                <div>
                  <h3 className="text-lg font-bold">Praksa</h3>
                  <p className="text-sm text-gray-600">
                    Početne pozicije za studente i juniore
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur transition hover:translate-x-1 hover:border-[#1a75ff]/40 hover:shadow-xl hover:shadow-[#1a75ff]/10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf2ff] font-mono text-sm font-bold text-[#1a75ff]">
                  ◎
                </div>
                <div>
                  <h3 className="text-lg font-bold">Remote</h3>
                  <p className="text-sm text-gray-600">
                    Poslovi iz BiH za domaće i strane firme
                  </p>
                </div>
              </div>
            </div>

            {/* DESNO: naslov, tekst i dugmad */}
            <div className="space-y-7 lg:order-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1a75ff]/20 bg-white/80 px-4 py-1.5 text-sm font-medium text-[#1a75ff] shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#1a75ff]" />
                IT Prakse i Junior Poslovi
              </span>

              <h1
                className={`${outfit.className} text-5xl font-black italic uppercase leading-[1.05] tracking-tight md:text-6xl`}
              >
                Pronađi praksu i prvi posao u{" "}
                <span className="bg-gradient-to-r from-[#1a75ff] to-[#5ea8ff] bg-clip-text pr-2 text-transparent">
                  IT industriji
                </span>
              </h1>

              <h2 className="max-w-xl text-lg leading-relaxed text-gray-600 md:text-xl">
                Pregledaj juniorske pozicije, prakse i pošalji prijavu online na
                jednostavan i brz način.
              </h2>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/oglasi"
                  className="rounded-2xl bg-[#1a75ff] px-7 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-[#1a75ff]/30 transition hover:-translate-y-0.5 hover:bg-[#0f5fd6]"
                >
                  Pogledaj oglase
                </Link>

                {user?.role !== "osoba" && (
                  <Link
                    href={objaviHref}
                    className="rounded-2xl border border-gray-300 bg-white px-7 py-3.5 text-center text-base font-semibold text-[#0b1220] transition hover:-translate-y-0.5 hover:border-[#1a75ff] hover:text-[#1a75ff]"
                  >
                    Objavi oglas
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ================= NAJNOVIJI OGLASI (sivo) ================= */}
      <div className="border-b border-gray-200 bg-[#f5f7fa]">
        <section className="mx-auto max-w-7xl px-6 py-20">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#1a75ff]">
            Oglasi
          </p>
          <h2 className={`${outfit.className} mb-10 text-3xl font-extrabold tracking-tight md:text-4xl`}>
            NAJNOVIJI OGLASI
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.map((oglas) => (
              <div
                key={oglas.OglasID}
                className="group flex flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#1a75ff]/40 hover:shadow-xl hover:shadow-[#1a75ff]/10"
              >
                <span className="mb-4 w-fit rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-semibold text-[#1a75ff]">
                  {oglas.Tip}
                </span>

                <h3 className="text-xl font-bold transition group-hover:text-[#1a75ff]">
                  {oglas.Pozicija}
                </h3>

                <p className="mt-2 text-gray-600">
                  {oglas.Firma} • {oglas.Lokacija}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                  <span className="text-gray-500">Datum objave</span>
                  <span className="font-medium">
                    {new Date(oglas.Datum).toLocaleDateString("sr-RS")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= KAKO FUNKCIONIŠE (bijelo) ================= */}
      <div className="bg-white">
        <section className="mx-auto max-w-7xl px-6 py-20">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#1a75ff]">
            Proces
          </p>
          <h2 className={`${outfit.className} mb-10 text-3xl font-extrabold tracking-tight md:text-4xl`}>
            KAKO FUNKCIONIŠE
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-[#f5f7fa] p-8">
              <p className="mb-6 text-5xl font-extrabold text-[#1a75ff]">01</p>
              <h3 className="mb-2 text-xl font-bold">Pretraži oglase</h3>
              <p className="text-gray-600">
                Pregledaj otvorene prakse i juniorske pozicije po tehnologiji,
                gradu ili tipu rada.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-[#f5f7fa] p-8">
              <p className="mb-6 text-5xl font-extrabold text-[#1a75ff]">02</p>
              <h3 className="mb-2 text-xl font-bold">Pošalji prijavu</h3>
              <p className="text-gray-600">
                Napravi profil, sačuvaj svoj CV i prijavi se na željeni oglas u
                nekoliko klikova.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-[#f5f7fa] p-8">
              <p className="mb-6 text-5xl font-extrabold text-[#1a75ff]">03</p>
              <h3 className="mb-2 text-xl font-bold">Započni karijeru</h3>
              <p className="text-gray-600">
                Prati status prijave i pronađi svoju prvu priliku u IT svijetu.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ================= BROJKE (tamno) ================= */}
      <div className="bg-[#0b1220]">
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <h2 className="bg-gradient-to-r from-[#5ea8ff] to-[#1a75ff] bg-clip-text text-5xl font-extrabold text-transparent">
                120+
              </h2>
              <p className="mt-2 text-gray-400">Broj oglasa</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <h2 className="bg-gradient-to-r from-[#5ea8ff] to-[#1a75ff] bg-clip-text text-5xl font-extrabold text-transparent">
                45+
              </h2>
              <p className="mt-2 text-gray-400">Broj firmi</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <h2 className="bg-gradient-to-r from-[#5ea8ff] to-[#1a75ff] bg-clip-text text-5xl font-extrabold text-transparent">
                800+
              </h2>
              <p className="mt-2 text-gray-400">Broj kandidata</p>
            </div>
          </div>
        </section>
      </div>

      {/* ================= O PLATFORMI (sivo) ================= */}
      <div className="border-b border-gray-200 bg-[#f5f7fa]">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
          {/* LIJEVO: opis */}
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#1a75ff]">
              O platformi
            </p>
            <h2 className={`${outfit.className} mb-6 text-3xl font-extrabold tracking-tight md:text-4xl`}>
              ŠTA JE INTERHUB?
            </h2>

            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              InterHUB je platforma namijenjena studentima i mladim IT
              stručnjacima koji traže svoju prvu praksu ili juniorski posao, kao
              i firmama koje žele da pronađu nove talente.
            </p>

            <p className="leading-relaxed text-gray-600">
              Ideja je jednostavna: umjesto da se oglasi za prakse gube po
              društvenim mrežama i raznim portalima, sve je na jednom mjestu.
              Kandidati lako pronalaze prilike koje im odgovaraju, a firme
              dobijaju prijave od motivisanih ljudi spremnih da uče.
            </p>
          </div>

          {/* DESNO: tri prednosti */}
          <div className="space-y-4">
            <div className="flex gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a75ff] font-bold text-white">
                ✓
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold">Fokus na početnike</h3>
                <p className="text-gray-600">
                  Samo prakse i juniorske pozicije, bez oglasa koji traže pet
                  godina iskustva.
                </p>
              </div>
            </div>

            <div className="flex gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a75ff] font-bold text-white">
                ✓
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold">Sve na jednom mjestu</h3>
                <p className="text-gray-600">
                  Profil, CV, prijave i status prijave dostupni su iz jednog
                  naloga.
                </p>
              </div>
            </div>

            <div className="flex gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a75ff] font-bold text-white">
                ✓
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold">Lokalno i remote</h3>
                <p className="text-gray-600">
                  Prilike iz Bosne i Hercegovine, ali i remote pozicije kod
                  stranih firmi.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ================= ZAVRŠNI CTA (bijelo) ================= */}
      <div className="bg-white">
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#1a75ff]">
              Pridruži se
            </p>
            <h2 className={`${outfit.className} text-3xl font-extrabold tracking-tight md:text-4xl`}>
              SPREMAN ZA SLJEDEĆI KORAK?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Izaberi svoju stranu i kreni, bilo da tražiš posao ili ljude za
              svoj tim.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Kartica za kandidate (plava) */}
            <div className="relative overflow-hidden rounded-3xl bg-[#1a75ff] p-10 text-white shadow-xl shadow-[#1a75ff]/30">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />

              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/70">
                Za kandidate
              </p>
              <h3 className={`${outfit.className} mb-4 text-3xl font-extrabold`}>
                Tražiš prvu priliku u IT-u?
              </h3>
              <p className="mb-8 max-w-md text-white/80">
                Napravi profil, dodaj svoj CV i prijavi se na prakse i juniorske
                pozicije u par klikova.
              </p>

              <Link
                href={kandidatHref}
                className="inline-block rounded-2xl bg-white px-7 py-3.5 font-semibold text-[#1a75ff] transition hover:-translate-y-0.5 hover:bg-[#eaf2ff]"
              >
                Napravi profil
              </Link>
            </div>

            {/* Kartica za firme (tamna) */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0b1220] p-10 text-white shadow-xl">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#1a75ff]/20" />

              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#5ea8ff]">
                Za firme
              </p>
              <h3 className={`${outfit.className} mb-4 text-3xl font-extrabold`}>
                Tražiš juniore i praktikante?
              </h3>
              <p className="mb-8 max-w-md text-gray-400">
                Objavi oglas i pronađi motivisane mlade ljude spremne da uče i
                rastu u tvom timu.
              </p>

              <Link
                href={objaviHref}
                className="inline-block rounded-2xl bg-[#1a75ff] px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0f5fd6]"
              >
                Objavi oglas
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}