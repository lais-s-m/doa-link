import { createCauseAction } from "@/lib/actions";

export default function CriarCausaPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-20 dark:bg-black">
      <main className="flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Criar página de doações
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Depois de criar, você poderá adicionar os itens que a causa está
            precisando (ração, cobertores, etc).
          </p>
        </div>

        <form action={createCauseAction} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nome da causa
            </span>
            <input
              type="text"
              name="name"
              required
              placeholder="Ex: Patinhas de Rua"
              className="h-11 rounded-lg border border-black/10 bg-white px-3 text-black outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-400"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Instagram (opcional)
            </span>
            <input
              type="text"
              name="instagram"
              placeholder="@patinhasderua"
              className="h-11 rounded-lg border border-black/10 bg-white px-3 text-black outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-400"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Senha para editar
            </span>
            <input
              type="password"
              name="password"
              required
              minLength={4}
              placeholder="Pelo menos 4 caracteres"
              className="h-11 rounded-lg border border-black/10 bg-white px-3 text-black outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-400"
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Guarde bem: ela é a única forma de atualizar esta página depois.
              Não tem recuperação.
            </span>
          </label>

          <button
            type="submit"
            className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-emerald-600 px-5 font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400"
          >
            Criar
          </button>
        </form>
      </main>
    </div>
  );
}
