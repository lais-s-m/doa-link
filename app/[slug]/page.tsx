import Link from "next/link";
import { notFound } from "next/navigation";
import { getCause } from "@/lib/db";
import { ProgressBar } from "@/components/progress-bar";

export default async function CausePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cause = await getCause(slug);

  if (!cause) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {cause.name}
          </h1>
          {cause.instagram && (
            <a
              href={`https://instagram.com/${cause.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
            >
              @{cause.instagram}
            </a>
          )}
          <p className="text-zinc-600 dark:text-zinc-400">
            Veja o que ainda falta para a gente bater a meta. Qualquer ajuda
            conta!
          </p>
        </div>

        {cause.items.length === 0 ? (
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            Nenhuma necessidade cadastrada ainda.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {cause.items.map((item) => {
              const percent =
                item.target > 0
                  ? Math.min(100, Math.round((item.current / item.target) * 100))
                  : 0;
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-950"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-black dark:text-zinc-50">
                      {item.label}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {item.current}/{item.target} {item.unit}
                    </span>
                  </div>
                  <ProgressBar current={item.current} target={item.target} />
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {percent}% atingido
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <Link
          href={`/${cause.slug}/editar`}
          className="text-center text-sm text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Atualizar esta causa
        </Link>
      </main>
    </div>
  );
}
