import type {
    Board,
    Card,
    Column,
    CreateCardInput,
    CreateColumnInput,
    CreateLabelInput,
    Label,
    MoveCardInput,
    ReorderColumnsInput,
    UpdateCardInput,
    UpdateColumnInput,
    UpdateLabelInput,
} from '@kanban/shared';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Request failed: ${res.status}`);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
}

export const api = {
    getBoard: () => request<Board>('/api/board'),

    createColumn: (input: CreateColumnInput) =>
        request<Column>('/api/columns', { method: 'POST', body: JSON.stringify(input) }),
    updateColumn: (id: string, input: UpdateColumnInput) =>
        request<Column>(`/api/columns/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
    deleteColumn: (id: string) => request<void>(`/api/columns/${id}`, { method: 'DELETE' }),
    reorderColumns: (input: ReorderColumnsInput) =>
        request<Column[]>('/api/columns/reorder', { method: 'PATCH', body: JSON.stringify(input) }),

    createCard: (input: CreateCardInput) =>
        request<Card>('/api/cards', { method: 'POST', body: JSON.stringify(input) }),
    updateCard: (id: string, input: UpdateCardInput) =>
        request<Card>(`/api/cards/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
    deleteCard: (id: string) => request<void>(`/api/cards/${id}`, { method: 'DELETE' }),
    moveCard: (input: MoveCardInput) =>
        request<Card>('/api/cards/move', { method: 'PATCH', body: JSON.stringify(input) }),

    createLabel: (input: CreateLabelInput) =>
        request<Label>('/api/labels', { method: 'POST', body: JSON.stringify(input) }),
    updateLabel: (id: string, input: UpdateLabelInput) =>
        request<Label>(`/api/labels/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
    deleteLabel: (id: string) => request<void>(`/api/labels/${id}`, { method: 'DELETE' }),
};
