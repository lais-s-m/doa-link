"use client";

import { useActionState, useRef } from "react";
import { toast } from "sonner";
import { addItemAction, type ActionResult } from "@/lib/actions";

export function AddItemForm({ slug }: { slug: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  const [, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await addItemAction(slug, formData);
      if (result.success) {
        toast.success("Item adicionado!");
        formRef.current?.reset();
      } else {
        toast.error(result.error);
      }
      return result;
    },
    null,
  );

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
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
        disabled={isPending}
        className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-emerald-600 px-5 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400"
      >
        {isPending ? "Adicionando..." : "Adicionar"}
      </button>
    </form>
  );
}
