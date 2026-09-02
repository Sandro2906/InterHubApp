import { createOglas } from "@/lib/actions";

export default function NoviOglasPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-10 text-white">
      <form action={createOglas} className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-3xl font-bold">Dodaj novi oglas</h1>

        <input name="pozicija" placeholder="Pozicija" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" />
        <input name="firma" placeholder="Firma" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" />
        <input name="lokacija" placeholder="Lokacija" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" />
        <input name="tip" placeholder="Tip" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" />
        <input name="iskustvo" placeholder="Iskustvo" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" />
        <input name="plata" type="number" step="0.01" placeholder="Plata" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" />
        <input name="datum" type="date" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" />
        <input name="question1" placeholder="Pitanje 1" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" />
        <input name="question2" placeholder="Pitanje 2" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" />
        <input name="question3" placeholder="Pitanje 3" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3" />

        <button className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold">
          Dodaj oglas
        </button>
      </form>
    </div>
  );
}