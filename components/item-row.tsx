"use client";

import { useActionState, useState } from "react";
import { toast } from "sonner";
import {
  deleteItemAction,
  updateItemAction,
  type ActionResult,
} from "@/lib/actions";
import type { Item } from "@/lib/db";

export function ItemRow({ slug, item }: { slug: string; item: Item }) {
  const [justUpdated, setJustUpdated] = useState(false);

  const [, updateAction, isUpdating] = useActionState<
    ActionResult | null,
    FormData
  >(async (_prev, formData) => {
    const result = await updateItemAction(slug, item.id, formData);
    if (result.success) {
      toast.success(`${item.label} atualizado!`);
      setJustUpdated(true);
    } else {
      toast.error(result.error);
    }
    return result;
  }, null);

  const [, deleteAction, isDeleting] = useActionState<
    ActionResult | null,
    FormData
  >(async () => {
    const result = await deleteItemAction(slug, item.id);
    if (result.success) {
      toast.success(`${item.label} removido.`);
    } else {
      toast.error(result.error);
    }
    return result;
  }, null);

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-950">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="font-medium text-black dark:text-zinc-50">
          {item.label}
        </span>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          meta: {item.target} {item.unit}
        </span>
      </div>

      <form
        action={updateAction}
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="current"
            defaultValue={item.current}
            min={0}
            step="any"
            onChange={() => setJustUpdated(false)}
            className="h-10 w-24 rounded-lg border border-black/10 bg-white px-2 text-black outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-400"
          />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {item.unit} atuais
          </span>
        </div>
        <button
          type="submit"
          disabled={isUpdating}
          className="h-10 w-full cursor-pointer rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400 sm:ml-auto sm:w-auto"
        >
          {isUpdating ? "Atualizando..." : justUpdated ? "Atualizado" : "Atualizar"}
        </button>
      </form>

      <form action={deleteAction}>
        <button
          type="submit"
          disabled={isDeleting}
          className="cursor-pointer text-xs text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400"
        >
          {isDeleting ? "Removendo..." : "Remover item"}
        </button>
      </form>
    </li>
  );
}
