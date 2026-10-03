"use client";

import { useActionState } from "react";
import { toast } from "sonner";
import { createCauseAction, type ActionResult } from "@/lib/actions";

export function CreateCauseForm() {
  const [, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await createCauseAction(formData);
      if (!result.success) {
        toast.error(result.error);
      }
      return result;
    },
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
        disabled={isPending}
        className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-emerald-600 px-5 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400"
      >
        {isPending ? "Criando..." : "Criar"}
      </button>
    </form>
  );
}
