import Link from "next/link";
import { registerUser } from "@/lib/actions";
import { outfit } from "@/lib/fonts";

// Iste klase za polja i labele
const inputClass =
  "w-full rounded-2xl border border-gray-300 bg-[#f5f7fa] px-4 py-3 text-[#0b1220] placeholder:text-gray-400 outline-none transition focus:border-[#1a75ff] focus:bg-white focus:ring-4 focus:ring-[#1a75ff]/10";

const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

export default function RegisterPage() {
  return (
    <div className="grid min-h-screen bg-white text-[#0b1220] lg:grid-cols-2">
      {/* ================= LIJEVO: tamni panel (samo na velikim ekranima) ================= */}
      <div className="relative hidden overflow-hidden bg-[#0b1220] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* Dekorativni krugovi */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#1a75ff]/20" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#1a75ff]/10" />

        <p className="relative text-2xl font-extrabold">
          Inter<span className="text-[#5ea8ff]">HUB</span>
        </p>

        <div className="relative">
          <h2 className={`${outfit.className} text-4xl font-black uppercase italic leading-tight`}>
            Tvoj prvi korak u{" "}
            <span className="text-[#5ea8ff]">IT industriju</span>
          </h2>

          <ul className="mt-8 space-y-4 text-gray-300">
            <li className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a75ff] text-sm font-bold text-white">✓</span>
              Prakse i juniorske pozicije na jednom mjestu
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a75ff] text-sm font-bold text-white">✓</span>
              Prijava na oglas u par klikova
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a75ff] text-sm font-bold text-white">✓</span>
              Firme direktno pronalaze nove talente
            </li>
          </ul>
        </div>

        <p className="relative text-sm text-gray-500">
          © {new Date().getFullYear()} InterHUB
        </p>
      </div>

      {/* ================= DESNO: forma ================= */}
      <div className="flex items-center justify-center bg-[#f5f7fa] px-6 py-12 lg:bg-white">
        <form
          action={registerUser}
          className="w-full max-w-md space-y-5 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm lg:border-0 lg:shadow-none"
        >
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-[#1a75ff]">
              Novi nalog
            </p>
            <h1 className={`${outfit.className} text-3xl font-extrabold tracking-tight`}>
              REGISTRACIJA
            </h1>
            <p className="mt-2 text-gray-600">
              Napravi nalog i počni za par minuta.
            </p>
          </div>

          <div>
            <label className={labelClass}>Ime</label>
            <input name="ime" placeholder="Tvoje ime ili naziv firme" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input name="email" type="email" placeholder="ime@email.com" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Lozinka</label>
            <input name="password" type="password" placeholder="••••••••" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Registrujem se kao</label>
            <select name="role" className={inputClass}>
              <option value="osoba">Kandidat (tražim praksu ili posao)</option>
              <option value="firma">Firma (objavljujem oglase)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              LinkedIn <span className="font-normal text-gray-400">(opciono)</span>
            </label>
            <input
              name="linkedin_url"
              type="url"
              placeholder="https://www.linkedin.com/in/..."
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-2xl bg-[#1a75ff] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#1a75ff]/30 transition hover:-translate-y-0.5 hover:bg-[#0f5fd6]"
          >
            Registruj se
          </button>

          <p className="text-center text-sm text-gray-600">
            Već imaš nalog?{" "}
            <Link href="/login" className="font-semibold text-[#1a75ff] hover:underline">
              Prijavi se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}