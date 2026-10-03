"use client";

import { useActionState } from "react";
import { toast } from "sonner";
import { unlockCauseAction, type ActionResult } from "@/lib/actions";

export function UnlockForm({ slug }: { slug: string }) {
  const [, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await unlockCauseAction(slug, formData);
      if (!result.success) {
        toast.error(result.error);
      }
      return result;
    },
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input
        type="password"
        name="password"
        required
        placeholder="Senha"
        className="h-11 rounded-lg border border-black/10 bg-white px-3 text-black outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-400"
      />
      <button
        type="submit"
        disabled={isPending}
        className="flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-emerald-600 px-5 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
