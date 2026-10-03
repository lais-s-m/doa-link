import Link from "next/link";
import { getCauses } from "@/lib/db";

export default async function Home() {
  const causes = await getCauses();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-20 dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-10">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            doa-link
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Um link na bio para a sua causa. Mostre em tempo real o que ainda
            falta para bater a meta de doações.
          </p>
        </div>

        <Link
          href="/criar"
          className="flex h-12 w-full items-center justify-center rounded-full bg-emerald-600 px-5 font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400"
        >
          Criar página de doações
        </Link>

        {causes.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Causas cadastradas
            </h2>
            <ul className="flex flex-col gap-2">
              {causes.map((cause) => (
                <li key={cause.slug}>
                  <Link
                    href={`/${cause.slug}`}
                    className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-3 transition-colors hover:border-black/20 dark:border-white/10 dark:bg-zinc-950 dark:hover:border-white/20"
                  >
                    <span className="font-medium text-black dark:text-zinc-50">
                      {cause.name}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      /{cause.slug}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
