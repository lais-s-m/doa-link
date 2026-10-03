import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";

const FILE_PATH = path.join(process.cwd(), "data", "db.json");
const REDIS_KEY = "doa-link:db";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

/**
 * Local dev (no Upstash env vars): reads/writes data/db.json on disk.
 * Deployed (Upstash env vars set): reads/writes a single JSON blob in Redis,
 * since Vercel's filesystem is ephemeral and won't persist writes.
 */
export async function readJson<T>(fallback: T): Promise<T> {
  if (redis) {
    const data = await redis.get<T>(REDIS_KEY);
    return data ?? fallback;
  }
  const raw = await fs.readFile(FILE_PATH, "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeJson<T>(data: T): Promise<void> {
  if (redis) {
    await redis.set(REDIS_KEY, data);
    return;
  }
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2) + "\n");
}
