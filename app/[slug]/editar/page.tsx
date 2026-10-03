import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCause } from "@/lib/db";
import {
  addItemAction,
  deleteItemAction,
  lockCauseAction,
  unlockCauseAction,
  updateItemAction,
} from "@/lib/actions";

export default async function EditarCausaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { slug } = await params;
  const { erro } = await searchParams;
  const cause = await getCause(slug);

  if (!cause) {
    notFound();
  }

  const token = (await cookies()).get(`doa_edit_${slug}`)?.value;
  const unlocked = token === cause.editToken;

  if (!unlocked) {
    const unlockCause = unlockCauseAction.bind(null, slug);
    return (
      <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-20 dark:bg-black">
        <main className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {cause.name}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Digite a senha de edição desta causa.
            </p>
          </div>

          <form action={unlockCause} className="flex flex-col gap-3">
            <input
              type="password"
              name="password"
              required
              placeholder="Senha"
              className="h-11 rounded-lg border border-black/10 bg-white px-3 text-black outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-400"
            />
            {erro && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Senha incorreta.
              </p>
            )}
            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center rounded-full bg-emerald-600 px-5 font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400"
            >
              Entrar
            </button>
          </form>
        </main>
      </div>
    );
  }

  const addItem = addItemAction.bind(null, slug);
  const lockCause = lockCauseAction.bind(null, slug);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {cause.name}
            </h1>
            <form action={lockCause}>
              <button
                type="submit"
                className="text-sm text-zinc-500 hover:underline dark:text-zinc-400"
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
            {cause.items.map((item) => {
              const updateItem = updateItemAction.bind(null, slug, item.id);
              const deleteItem = deleteItemAction.bind(null, slug, item.id);
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-950"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-black dark:text-zinc-50">
                      {item.label}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      meta: {item.target} {item.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <form action={updateItem} className="flex flex-1 items-center gap-2">
                      <input
                        type="number"
                        name="current"
                        defaultValue={item.current}
                        min={0}
                        step="any"
                        className="h-10 w-24 rounded-lg border border-black/10 bg-white px-2 text-black outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-400"
                      />
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {item.unit} atuais
                      </span>
                      <button
                        type="submit"
                        className="ml-auto h-10 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400"
                      >
                        Atualizar
                      </button>
                    </form>
                  </div>

                  <form action={deleteItem}>
                    <button
                      type="submit"
                      className="text-xs text-red-600 hover:underline dark:text-red-400"
                    >
                      Remover item
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-950">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Adicionar necessidade
          </h2>
          <form action={addItem} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nome
              </span>
              <input
                type="text"
                name="label"
                required
                placeholder="Ex: Ração"
                className="h-11 rounded-lg border border-black/10 bg-white px-3 text-black outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-400"
              />
            </label>

            <div className="flex gap-3">
              <label className="flex flex-1 flex-col gap-1">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Unidade
                </span>
                <input
                  type="text"
                  name="unit"
                  required
                  placeholder="Ex: kg, unidades"
                  className="h-11 rounded-lg border border-black/10 bg-white px-3 text-black outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-400"
                />
              </label>

              <label className="flex flex-1 flex-col gap-1">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Meta
                </span>
                <input
                  type="number"
                  name="target"
                  required
                  min={1}
                  step="any"
                  placeholder="Ex: 10"
                  className="h-11 rounded-lg border border-black/10 bg-white px-3 text-black outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-400"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 flex h-11 w-full items-center justify-center rounded-full bg-emerald-600 px-5 font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400"
            >
              Adicionar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
