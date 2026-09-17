import { JSONFilePreset } from 'lowdb/node';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Board } from '@kanban/shared';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface DbShape {
    board: Board;
}

const dbPath = resolve(__dirname, '../data/db.json');
const seedPath = resolve(__dirname, '../data/db.seed.json');

async function loadSeed(): Promise<DbShape> {
    const raw = await readFile(seedPath, 'utf-8');
    return JSON.parse(raw) as DbShape;
}

const seed = await loadSeed();
export const db = await JSONFilePreset<DbShape>(dbPath, seed);

export async function persist(): Promise<void> {
    await db.write();
}
