export type ID = string;

export interface Label {
    id: ID;
    name: string;
    color: string; // hex
}

export interface Member {
    id: ID;
    name: string;
    initials: string;
    color: string; // avatar bg
}

export interface Card {
    id: ID;
    columnId: ID;
    title: string;
    description: string;
    labelIds: ID[];
    assigneeId?: ID;
    dueDate?: string; // ISO date
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface Column {
    id: ID;
    name: string;
    order: number;
    wipLimit?: number;
}

export interface Board {
    id: ID;
    name: string;
    columns: Column[];
    cards: Card[];
    labels: Label[];
    members: Member[];
}

// Request payloads
export interface CreateColumnInput {
    name: string;
    wipLimit?: number;
}
export interface UpdateColumnInput {
    name?: string;
    wipLimit?: number | null;
}
export interface ReorderColumnsInput {
    orderedIds: ID[];
}

export interface CreateCardInput {
    columnId: ID;
    title: string;
    description?: string;
    labelIds?: ID[];
    assigneeId?: ID;
    dueDate?: string;
}
export interface UpdateCardInput {
    title?: string;
    description?: string;
    labelIds?: ID[];
    assigneeId?: ID | null;
    dueDate?: string | null;
}
export interface MoveCardInput {
    cardId: ID;
    toColumnId: ID;
    toIndex: number;
}

export interface CreateLabelInput {
    name: string;
    color: string;
}
export interface UpdateLabelInput {
    name?: string;
    color?: string;
}

export interface ApiError {
    error: string;
    code?: string;
}
