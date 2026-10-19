import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutUser } from "@/lib/actions";

export default async function NavBar() {
  const user = await getCurrentUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b1220]/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-extrabold text-white">
          Inter<span className="text-[#5ea8ff]">HUB</span>
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="text-gray-300 transition hover:text-[#5ea8ff]">
            Home
          </Link>

          <Link href="/oglasi" className="text-gray-300 transition hover:text-[#5ea8ff]">
            Oglasi
          </Link>

          {user?.role === "firma" && (
            <Link href="/firmaDashboard" className="text-gray-300 transition hover:text-[#5ea8ff]">
              Firme
            </Link>
          )}

          {user?.role === "osoba" && (
            <Link href="/profil" className="text-gray-300 transition hover:text-[#5ea8ff]">
              Profil
            </Link>
          )}

          {user ? (
            <form action={logoutUser}>
              <button className="cursor-pointer rounded-xl border border-white/20 px-4 py-2 text-gray-300 transition hover:border-[#5ea8ff] hover:text-[#5ea8ff]">
                Logout
              </button>
            </form>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-white/20 px-4 py-2 text-gray-300 transition hover:border-[#5ea8ff] hover:text-[#5ea8ff]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-[#1a75ff] px-4 py-2 font-semibold text-white shadow-md shadow-[#1a75ff]/30 transition hover:bg-[#0f5fd6]"
              >
                Registracija
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}