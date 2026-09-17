import { Router } from 'express';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { db, persist } from '../db.js';
import { notFound, HttpError } from '../errors.js';

export const cardsRouter = Router();

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}/);

const createSchema = z.object({
    columnId: z.string(),
    title: z.string().min(1).max(200),
    description: z.string().max(5000).optional(),
    labelIds: z.array(z.string()).optional(),
    assigneeId: z.string().optional(),
    dueDate: isoDate.optional(),
});

const updateSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).optional(),
    labelIds: z.array(z.string()).optional(),
    assigneeId: z.string().nullable().optional(),
    dueDate: isoDate.nullable().optional(),
});

const moveSchema = z.object({
    cardId: z.string(),
    toColumnId: z.string(),
    toIndex: z.number().int().min(0),
});

function recomputeOrder(cards: { columnId: string; order: number }[], columnId: string) {
    cards
        .filter((c) => c.columnId === columnId)
        .sort((a, b) => a.order - b.order)
        .forEach((c, i) => (c.order = i));
}

cardsRouter.post('/', async (req, res, next) => {
    try {
        const input = createSchema.parse(req.body);
        const board = db.data.board;
        const column = board.columns.find((c) => c.id === input.columnId);
        if (!column) throw notFound('Column');
        const nowIso = new Date().toISOString();
        const orderInColumn = board.cards.filter((c) => c.columnId === input.columnId).length;
        const card = {
            id: `card-${nanoid(8)}`,
            columnId: input.columnId,
            title: input.title,
            description: input.description ?? '',
            labelIds: input.labelIds ?? [],
            ...(input.assigneeId ? { assigneeId: input.assigneeId } : {}),
            ...(input.dueDate ? { dueDate: input.dueDate } : {}),
            order: orderInColumn,
            createdAt: nowIso,
            updatedAt: nowIso,
        };
        board.cards.push(card);
        await persist();
        res.status(201).json(card);
    } catch (e) {
        next(e);
    }
});

cardsRouter.patch('/move', async (req, res, next) => {
    try {
        const { cardId, toColumnId, toIndex } = moveSchema.parse(req.body);
        const board = db.data.board;
        const card = board.cards.find((c) => c.id === cardId);
        if (!card) throw notFound('Card');
        const targetColumn = board.columns.find((c) => c.id === toColumnId);
        if (!targetColumn) throw notFound('Column');

        const fromColumnId = card.columnId;
        card.columnId = toColumnId;
        card.updatedAt = new Date().toISOString();

        // Place card at toIndex within target column ordering.
        const targetCards = board.cards
            .filter((c) => c.columnId === toColumnId && c.id !== cardId)
            .sort((a, b) => a.order - b.order);
        const clampedIndex = Math.min(Math.max(toIndex, 0), targetCards.length);
        targetCards.splice(clampedIndex, 0, card);
        targetCards.forEach((c, i) => (c.order = i));

        if (fromColumnId !== toColumnId) {
            recomputeOrder(board.cards, fromColumnId);
        }

        await persist();
        res.json(card);
    } catch (e) {
        next(e);
    }
});

cardsRouter.patch('/:id', async (req, res, next) => {
    try {
        const input = updateSchema.parse(req.body);
        const card = db.data.board.cards.find((c) => c.id === req.params.id);
        if (!card) throw notFound('Card');
        if (input.title !== undefined) card.title = input.title;
        if (input.description !== undefined) card.description = input.description;
        if (input.labelIds !== undefined) card.labelIds = input.labelIds;
        if (input.assigneeId === null) delete card.assigneeId;
        else if (input.assigneeId !== undefined) card.assigneeId = input.assigneeId;
        if (input.dueDate === null) delete card.dueDate;
        else if (input.dueDate !== undefined) card.dueDate = input.dueDate;
        card.updatedAt = new Date().toISOString();
        await persist();
        res.json(card);
    } catch (e) {
        next(e);
    }
});

cardsRouter.delete('/:id', async (req, res, next) => {
    try {
        const board = db.data.board;
        const idx = board.cards.findIndex((c) => c.id === req.params.id);
        if (idx === -1) throw notFound('Card');
        const [removed] = board.cards.splice(idx, 1);
        recomputeOrder(board.cards, removed.columnId);
        await persist();
        res.status(204).send();
    } catch (e) {
        next(e);
    }
});

// Avoid unused import warning under strict TS
void HttpError;
