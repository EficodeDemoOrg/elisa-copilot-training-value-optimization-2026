import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
    Board,
    CreateCardInput,
    CreateColumnInput,
    CreateLabelInput,
    MoveCardInput,
    ReorderColumnsInput,
    UpdateCardInput,
    UpdateColumnInput,
    UpdateLabelInput,
} from '@kanban/shared';
import { api } from '../lib/api';
import { moveCard as moveCardPure, reorderColumns as reorderColumnsPure } from '../lib/dnd';
import { useUi } from '../store/ui';

const BOARD_KEY = ['board'] as const;

export function useBoard() {
    return useQuery({ queryKey: BOARD_KEY, queryFn: api.getBoard });
}

function useToastOnError() {
    const pushToast = useUi((s) => s.pushToast);
    return (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error';
        pushToast({ title: 'Something went wrong', description: message, tone: 'danger' });
    };
}

export function useCreateColumn() {
    const qc = useQueryClient();
    const onError = useToastOnError();
    return useMutation({
        mutationFn: (input: CreateColumnInput) => api.createColumn(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: BOARD_KEY }),
        onError,
    });
}

export function useUpdateColumn() {
    const qc = useQueryClient();
    const onError = useToastOnError();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateColumnInput }) => api.updateColumn(id, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: BOARD_KEY }),
        onError,
    });
}

export function useDeleteColumn() {
    const qc = useQueryClient();
    const onError = useToastOnError();
    return useMutation({
        mutationFn: (id: string) => api.deleteColumn(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: BOARD_KEY }),
        onError,
    });
}

export function useReorderColumns() {
    const qc = useQueryClient();
    const onError = useToastOnError();
    return useMutation({
        mutationFn: (input: ReorderColumnsInput) => api.reorderColumns(input),
        onMutate: async ({ orderedIds }) => {
            await qc.cancelQueries({ queryKey: BOARD_KEY });
            const prev = qc.getQueryData<Board>(BOARD_KEY);
            if (prev) qc.setQueryData<Board>(BOARD_KEY, reorderColumnsPure(prev, orderedIds));
            return { prev };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.prev) qc.setQueryData(BOARD_KEY, ctx.prev);
            onError(err);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: BOARD_KEY }),
    });
}

export function useCreateCard() {
    const qc = useQueryClient();
    const onError = useToastOnError();
    return useMutation({
        mutationFn: (input: CreateCardInput) => api.createCard(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: BOARD_KEY }),
        onError,
    });
}

export function useUpdateCard() {
    const qc = useQueryClient();
    const onError = useToastOnError();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateCardInput }) => api.updateCard(id, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: BOARD_KEY }),
        onError,
    });
}

export function useDeleteCard() {
    const qc = useQueryClient();
    const onError = useToastOnError();
    return useMutation({
        mutationFn: (id: string) => api.deleteCard(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: BOARD_KEY }),
        onError,
    });
}

export function useMoveCard() {
    const qc = useQueryClient();
    const onError = useToastOnError();
    return useMutation({
        mutationFn: (input: MoveCardInput) => api.moveCard(input),
        onMutate: async (input) => {
            await qc.cancelQueries({ queryKey: BOARD_KEY });
            const prev = qc.getQueryData<Board>(BOARD_KEY);
            if (prev) qc.setQueryData<Board>(BOARD_KEY, moveCardPure(prev, input.cardId, input.toColumnId, input.toIndex));
            return { prev };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.prev) qc.setQueryData(BOARD_KEY, ctx.prev);
            onError(err);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: BOARD_KEY }),
    });
}

export function useCreateLabel() {
    const qc = useQueryClient();
    const onError = useToastOnError();
    return useMutation({
        mutationFn: (input: CreateLabelInput) => api.createLabel(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: BOARD_KEY }),
        onError,
    });
}

export function useUpdateLabel() {
    const qc = useQueryClient();
    const onError = useToastOnError();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateLabelInput }) => api.updateLabel(id, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: BOARD_KEY }),
        onError,
    });
}

export function useDeleteLabel() {
    const qc = useQueryClient();
    const onError = useToastOnError();
    return useMutation({
        mutationFn: (id: string) => api.deleteLabel(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: BOARD_KEY }),
        onError,
    });
}
