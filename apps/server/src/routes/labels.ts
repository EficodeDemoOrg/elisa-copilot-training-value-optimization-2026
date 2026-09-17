import { Router } from 'express';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { db, persist } from '../db.js';
import { notFound } from '../errors.js';

export const labelsRouter = Router();

const hex = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);

const createSchema = z.object({
    name: z.string().min(1).max(40),
    color: hex,
});
const updateSchema = z.object({
    name: z.string().min(1).max(40).optional(),
    color: hex.optional(),
});

labelsRouter.get('/', (_req, res) => {
    res.json(db.data.board.labels);
});

labelsRouter.post('/', async (req, res, next) => {
    try {
        const input = createSchema.parse(req.body);
        const label = { id: `lbl-${nanoid(6)}`, ...input };
        db.data.board.labels.push(label);
        await persist();
        res.status(201).json(label);
    } catch (e) {
        next(e);
    }
});

labelsRouter.patch('/:id', async (req, res, next) => {
    try {
        const input = updateSchema.parse(req.body);
        const label = db.data.board.labels.find((l) => l.id === req.params.id);
        if (!label) throw notFound('Label');
        Object.assign(label, input);
        await persist();
        res.json(label);
    } catch (e) {
        next(e);
    }
});

labelsRouter.delete('/:id', async (req, res, next) => {
    try {
        const board = db.data.board;
        const idx = board.labels.findIndex((l) => l.id === req.params.id);
        if (idx === -1) throw notFound('Label');
        board.labels.splice(idx, 1);
        board.cards.forEach((c) => {
            c.labelIds = c.labelIds.filter((id) => id !== req.params.id);
        });
        await persist();
        res.status(204).send();
    } catch (e) {
        next(e);
    }
});
