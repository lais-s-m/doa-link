import { CreateCauseForm } from "@/components/create-cause-form";

export default function CriarCausaPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-14 sm:px-6 sm:py-20 dark:bg-black">
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

        <CreateCauseForm />
      </main>
    </div>
  );
}
