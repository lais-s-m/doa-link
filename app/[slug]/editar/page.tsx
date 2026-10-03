import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCause } from "@/lib/db";
import { lockCauseAction } from "@/lib/actions";
import { UnlockForm } from "@/components/unlock-form";
import { AddItemForm } from "@/components/add-item-form";
import { ItemRow } from "@/components/item-row";

export default async function EditarCausaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cause = await getCause(slug);

  if (!cause) {
    notFound();
  }

  const token = (await cookies()).get(`doa_edit_${slug}`)?.value;
  const unlocked = token === cause.editToken;

  if (!unlocked) {
    return (
      <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-14 sm:px-6 sm:py-20 dark:bg-black">
        <main className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {cause.name}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Digite a senha de edição desta causa.
            </p>
          </div>

          <UnlockForm slug={slug} />
        </main>
      </div>
    );
  }

  const lockCause = lockCauseAction.bind(null, slug);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-10 sm:px-6 sm:py-16 dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="min-w-0 wrap-break-word text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {cause.name}
            </h1>
            <form action={lockCause} className="shrink-0">
              <button
                type="submit"
                className="cursor-pointer text-sm text-zinc-500 hover:underline dark:text-zinc-400"
              >
                Sair
              </button>
            </form>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Página pública:{" "}
            <Link
              href={`/${cause.slug}`}
              className="text-emerald-600 underline dark:text-emerald-400"
            >
              doa-link/{cause.slug}
            </Link>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Necessidades
          </h2>

          {cause.items.length === 0 && (
            <p className="text-zinc-500 dark:text-zinc-400">
              Nenhum item cadastrado ainda. Adicione o primeiro abaixo.
            </p>
          )}

          <ul className="flex flex-col gap-3">
            {cause.items.map((item) => (
              <ItemRow key={item.id} slug={slug} item={item} />
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-950">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Adicionar necessidade
          </h2>
          <AddItemForm slug={slug} />
        </div>
      </main>
    </div>
  );
}
