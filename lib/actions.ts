"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as db from "@/lib/db";
import { verifyPassword } from "@/lib/password";

const EDIT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

function editCookieName(slug: string): string {
  return `doa_edit_${slug}`;
}

async function setEditCookie(slug: string, editToken: string): Promise<void> {
  (await cookies()).set(editCookieName(slug), editToken, {
    httpOnly: true,
    sameSite: "lax",
    path: `/${slug}`,
    maxAge: EDIT_COOKIE_MAX_AGE,
  });
}

/** Verifica se a requisição atual tem permissão para editar a causa. */
async function assertEditAccess(slug: string): Promise<db.Cause> {
  const cause = await db.getCause(slug);
  if (!cause) {
    throw new Error("Causa não encontrada.");
  }

  const token = (await cookies()).get(editCookieName(slug))?.value;
  if (!token || token !== cause.editToken) {
    throw new Error("Não autorizado.");
  }

  return cause;
}

export async function createCauseAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "")
    .trim()
    .replace(/^@/, "");
  const password = String(formData.get("password") ?? "");

  if (!name) {
    throw new Error("Informe um nome para a causa.");
  }
  if (password.length < 4) {
    throw new Error("A senha precisa ter pelo menos 4 caracteres.");
  }

  const cause = await db.createCause({ name, instagram, password });
  await setEditCookie(cause.slug, cause.editToken);
  revalidatePath("/");
  redirect(`/${cause.slug}/editar`);
}

export async function unlockCauseAction(
  slug: string,
  formData: FormData,
): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const cause = await db.getCause(slug);

  if (!cause || !verifyPassword(password, cause.passwordHash)) {
    redirect(`/${slug}/editar?erro=1`);
  }

  await setEditCookie(slug, cause.editToken);
  redirect(`/${slug}/editar`);
}

export async function lockCauseAction(slug: string): Promise<void> {
  (await cookies()).delete({ name: editCookieName(slug), path: `/${slug}` });
  redirect(`/${slug}`);
}

export async function addItemAction(
  slug: string,
  formData: FormData,
): Promise<void> {
  await assertEditAccess(slug);

  const label = String(formData.get("label") ?? "").trim();
  const unit = String(formData.get("unit") ?? "").trim();
  const target = Number(formData.get("target"));

  if (!label || !unit || !Number.isFinite(target) || target <= 0) {
    throw new Error("Preencha nome, unidade e meta (maior que zero).");
  }

  await db.addItem(slug, { label, unit, target });
  revalidatePath(`/${slug}`);
  revalidatePath(`/${slug}/editar`);
}

export async function updateItemAction(
  slug: string,
  itemId: string,
  formData: FormData,
): Promise<void> {
  await assertEditAccess(slug);

  const current = Number(formData.get("current"));

  if (!Number.isFinite(current)) {
    throw new Error("Valor inválido.");
  }

  await db.updateItemCurrent(slug, itemId, current);
  revalidatePath(`/${slug}`);
  revalidatePath(`/${slug}/editar`);
}

export async function deleteItemAction(
  slug: string,
  itemId: string,
): Promise<void> {
  await assertEditAccess(slug);

  await db.deleteItem(slug, itemId);
  revalidatePath(`/${slug}`);
  revalidatePath(`/${slug}/editar`);
}
