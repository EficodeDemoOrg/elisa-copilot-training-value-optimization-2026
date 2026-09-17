import { Router } from 'express';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { db, persist } from '../db.js';
import { notFound } from '../errors.js';

export const columnsRouter = Router();

const createSchema = z.object({
    name: z.string().min(1).max(80),
    wipLimit: z.number().int().positive().nullable().optional(),
});

const updateSchema = z.object({
    name: z.string().min(1).max(80).optional(),
    wipLimit: z.number().int().positive().nullable().optional(),
});

const reorderSchema = z.object({
    orderedIds: z.array(z.string()).min(1),
});

columnsRouter.post('/', async (req, res, next) => {
    try {
        const input = createSchema.parse(req.body);
        const board = db.data.board;
        const column = {
            id: `col-${nanoid(8)}`,
            name: input.name,
            order: board.columns.length,
            ...(input.wipLimit ? { wipLimit: input.wipLimit } : {}),
        };
        board.columns.push(column);
        await persist();
        res.status(201).json(column);
    } catch (e) {
        next(e);
    }
});

columnsRouter.patch('/reorder', async (req, res, next) => {
    try {
        const { orderedIds } = reorderSchema.parse(req.body);
        const board = db.data.board;
        const byId = new Map(board.columns.map((c) => [c.id, c]));
        if (orderedIds.length !== board.columns.length || orderedIds.some((id) => !byId.has(id))) {
            throw notFound('Column');
        }
        orderedIds.forEach((id, idx) => {
            byId.get(id)!.order = idx;
        });
        board.columns.sort((a, b) => a.order - b.order);
        await persist();
        res.json(board.columns);
    } catch (e) {
        next(e);
    }
});

columnsRouter.patch('/:id', async (req, res, next) => {
    try {
        const input = updateSchema.parse(req.body);
        const column = db.data.board.columns.find((c) => c.id === req.params.id);
        if (!column) throw notFound('Column');
        if (input.name !== undefined) column.name = input.name;
        if (input.wipLimit === null) delete column.wipLimit;
        else if (input.wipLimit !== undefined) column.wipLimit = input.wipLimit;
        await persist();
        res.json(column);
    } catch (e) {
        next(e);
    }
});

columnsRouter.delete('/:id', async (req, res, next) => {
    try {
        const board = db.data.board;
        const idx = board.columns.findIndex((c) => c.id === req.params.id);
        if (idx === -1) throw notFound('Column');
        board.columns.splice(idx, 1);
        board.cards = board.cards.filter((card) => card.columnId !== req.params.id);
        board.columns.forEach((c, i) => (c.order = i));
        await persist();
        res.status(204).send();
    } catch (e) {
        next(e);
    }
});
