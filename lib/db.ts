import { readJson, writeJson } from "@/lib/storage";
import { hashPassword } from "@/lib/password";

export type Item = {
  id: string;
  label: string;
  unit: string;
  current: number;
  target: number;
};

export type Cause = {
  slug: string;
  name: string;
  instagram: string;
  passwordHash: string;
  editToken: string;
  items: Item[];
};

type Database = {
  causes: Cause[];
};

const EMPTY_DB: Database = { causes: [] };

async function readDb(): Promise<Database> {
  return readJson(EMPTY_DB);
}

async function writeDb(db: Database): Promise<void> {
  await writeJson(db);
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getCauses(): Promise<Cause[]> {
  const db = await readDb();
  return db.causes;
}

export async function getCause(slug: string): Promise<Cause | undefined> {
  const db = await readDb();
  return db.causes.find((cause) => cause.slug === slug);
}

export async function createCause(input: {
  name: string;
  instagram: string;
  password: string;
}): Promise<Cause> {
  const db = await readDb();

  const base = slugify(input.name) || "causa";
  let slug = base;
  let suffix = 2;
  while (db.causes.some((cause) => cause.slug === slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  const cause: Cause = {
    slug,
    name: input.name,
    instagram: input.instagram,
    passwordHash: hashPassword(input.password),
    editToken: crypto.randomUUID(),
    items: [],
  };
  db.causes.push(cause);
  await writeDb(db);
  return cause;
}

export async function addItem(
  slug: string,
  input: { label: string; unit: string; target: number },
): Promise<void> {
  const db = await readDb();
  const cause = db.causes.find((c) => c.slug === slug);
  if (!cause) throw new Error("Causa não encontrada.");

  cause.items.push({
    id: crypto.randomUUID(),
    label: input.label,
    unit: input.unit,
    current: 0,
    target: input.target,
  });
  await writeDb(db);
}

export async function updateItemCurrent(
  slug: string,
  itemId: string,
  current: number,
): Promise<void> {
  const db = await readDb();
  const item = db.causes
    .find((c) => c.slug === slug)
    ?.items.find((i) => i.id === itemId);
  if (!item) throw new Error("Item não encontrado.");

  item.current = Math.max(0, current);
  await writeDb(db);
}

export async function deleteItem(slug: string, itemId: string): Promise<void> {
  const db = await readDb();
  const cause = db.causes.find((c) => c.slug === slug);
  if (!cause) throw new Error("Causa não encontrada.");

  cause.items = cause.items.filter((i) => i.id !== itemId);
  await writeDb(db);
}
