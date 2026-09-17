import type { Board, Card } from '@kanban/shared';

export interface BoardFilters {
    search: string;
    labelIds: string[];
    assigneeIds: string[];
    onlyOverdue: boolean;
}

export const emptyFilters: BoardFilters = {
    search: '',
    labelIds: [],
    assigneeIds: [],
    onlyOverdue: false,
};

export function cardsByColumn(board: Board): Map<string, Card[]> {
    const map = new Map<string, Card[]>();
    for (const column of board.columns) map.set(column.id, []);
    for (const card of board.cards) {
        const list = map.get(card.columnId);
        if (list) list.push(card);
    }
    for (const list of map.values()) list.sort((a, b) => a.order - b.order);
    return map;
}

export function filterCards(cards: Card[], filters: BoardFilters): Card[] {
    const today = new Date().toISOString().slice(0, 10);
    const q = filters.search.trim().toLowerCase();
    return cards.filter((card) => {
        if (q && !`${card.title}\n${card.description}`.toLowerCase().includes(q)) return false;
        if (filters.labelIds.length && !card.labelIds.some((id) => filters.labelIds.includes(id))) return false;
        if (filters.assigneeIds.length && (!card.assigneeId || !filters.assigneeIds.includes(card.assigneeId)))
            return false;
        if (filters.onlyOverdue && (!card.dueDate || card.dueDate >= today)) return false;
        return true;
    });
}

export function hasActiveFilters(filters: BoardFilters): boolean {
    return (
        filters.search.length > 0 ||
        filters.labelIds.length > 0 ||
        filters.assigneeIds.length > 0 ||
        filters.onlyOverdue
    );
}
