import { describe, expect, it } from 'vitest';
import type { Board } from '@kanban/shared';
import { moveCard, reorderColumns } from './dnd';

function makeBoard(): Board {
    return {
        id: 'b',
        name: 'b',
        columns: [
            { id: 'a', name: 'A', order: 0 },
            { id: 'b', name: 'B', order: 1 },
        ],
        labels: [],
        members: [],
        cards: [
            { id: 'c1', columnId: 'a', title: 'c1', description: '', labelIds: [], order: 0, createdAt: '', updatedAt: '' },
            { id: 'c2', columnId: 'a', title: 'c2', description: '', labelIds: [], order: 1, createdAt: '', updatedAt: '' },
            { id: 'c3', columnId: 'a', title: 'c3', description: '', labelIds: [], order: 2, createdAt: '', updatedAt: '' },
            { id: 'c4', columnId: 'b', title: 'c4', description: '', labelIds: [], order: 0, createdAt: '', updatedAt: '' },
        ],
    };
}

describe('moveCard', () => {
    it('reorders within the same column', () => {
        const next = moveCard(makeBoard(), 'c1', 'a', 2);
        const a = next.cards.filter((c) => c.columnId === 'a').sort((x, y) => x.order - y.order);
        expect(a.map((c) => c.id)).toEqual(['c2', 'c3', 'c1']);
    });

    it('moves across columns and re-indexes both', () => {
        const next = moveCard(makeBoard(), 'c2', 'b', 0);
        const a = next.cards.filter((c) => c.columnId === 'a').sort((x, y) => x.order - y.order);
        const b = next.cards.filter((c) => c.columnId === 'b').sort((x, y) => x.order - y.order);
        expect(a.map((c) => c.id)).toEqual(['c1', 'c3']);
        expect(a.map((c) => c.order)).toEqual([0, 1]);
        expect(b.map((c) => c.id)).toEqual(['c2', 'c4']);
        expect(b.map((c) => c.order)).toEqual([0, 1]);
    });

    it('clamps out-of-range indices', () => {
        const next = moveCard(makeBoard(), 'c1', 'b', 99);
        const b = next.cards.filter((c) => c.columnId === 'b').sort((x, y) => x.order - y.order);
        expect(b.map((c) => c.id)).toEqual(['c4', 'c1']);
    });

    it('returns same board for unknown card', () => {
        const board = makeBoard();
        expect(moveCard(board, 'missing', 'a', 0)).toBe(board);
    });
});

describe('reorderColumns', () => {
    it('applies the new column order', () => {
        const next = reorderColumns(makeBoard(), ['b', 'a']);
        expect(next.columns.map((c) => c.id)).toEqual(['b', 'a']);
        expect(next.columns.map((c) => c.order)).toEqual([0, 1]);
    });
});
