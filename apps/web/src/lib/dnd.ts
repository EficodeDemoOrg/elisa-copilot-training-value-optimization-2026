import type { Board, Card } from '@kanban/shared';

/**
 * Pure helper that returns the next board state after moving a card.
 * Used both for optimistic UI and unit tests.
 */
export function moveCard(board: Board, cardId: string, toColumnId: string, toIndex: number): Board {
    const card = board.cards.find((c) => c.id === cardId);
    if (!card) return board;

    const fromColumnId = card.columnId;
    const otherCards = board.cards.filter((c) => c.id !== cardId);

    const targetCards = otherCards
        .filter((c) => c.columnId === toColumnId)
        .sort((a, b) => a.order - b.order);

    const movedCard: Card = { ...card, columnId: toColumnId };
    const clampedIndex = Math.min(Math.max(toIndex, 0), targetCards.length);
    targetCards.splice(clampedIndex, 0, movedCard);
    targetCards.forEach((c, i) => (c.order = i));

    let nextCards = otherCards.filter((c) => c.columnId !== toColumnId).concat(targetCards);

    if (fromColumnId !== toColumnId) {
        const fromCards = nextCards
            .filter((c) => c.columnId === fromColumnId)
            .sort((a, b) => a.order - b.order)
            .map((c, i) => ({ ...c, order: i }));
        nextCards = nextCards.filter((c) => c.columnId !== fromColumnId).concat(fromCards);
    }

    return { ...board, cards: nextCards };
}

export function reorderColumns(board: Board, orderedIds: string[]): Board {
    const idToOrder = new Map(orderedIds.map((id, i) => [id, i] as const));
    const nextColumns = board.columns
        .map((c) => ({ ...c, order: idToOrder.get(c.id) ?? c.order }))
        .sort((a, b) => a.order - b.order);
    return { ...board, columns: nextColumns };
}
