import { useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    closestCorners,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { useBoard, useMoveCard, useReorderColumns } from '../hooks/useBoard';
import { useFilters } from '../hooks/useFilters';
import { cardsByColumn, filterCards } from '../lib/board';
import { BoardHeader } from '../components/BoardHeader';
import { Column } from '../components/Column';
import { Card } from '../components/Card';
import { CardDialog } from '../components/CardDialog';
import { LabelManager } from '../components/LabelManager';
import { useUi } from '../store/ui';

export function BoardPage() {
    const { data: board, isLoading, isError, error } = useBoard();
    const [filters] = useFilters();
    const moveCardMutation = useMoveCard();
    const reorderColumnsMutation = useReorderColumns();
    const [activeCardId, setActiveCardId] = useState<string | null>(null);
    const cardDialogId = useUi((s) => s.cardDialogId);
    const labelManagerOpen = useUi((s) => s.labelManagerOpen);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor),
    );

    const grouped = useMemo(() => (board ? cardsByColumn(board) : null), [board]);
    const filteredById = useMemo(() => {
        if (!board || !grouped) return null;
        const map = new Map<string, ReturnType<typeof filterCards>>();
        for (const column of board.columns) {
            map.set(column.id, filterCards(grouped.get(column.id) ?? [], filters));
        }
        return map;
    }, [board, grouped, filters]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center text-ink-muted">Loading board…</div>
        );
    }
    if (isError || !board || !grouped || !filteredById) {
        return (
            <div className="flex h-full items-center justify-center text-danger">
                Failed to load board: {(error as Error)?.message ?? 'unknown error'}
            </div>
        );
    }

    const activeCard = activeCardId ? board.cards.find((c) => c.id === activeCardId) : null;

    function handleDragStart(e: DragStartEvent) {
        const type = e.active.data.current?.type;
        if (type === 'card') setActiveCardId(String(e.active.id));
    }

    function handleDragEnd(e: DragEndEvent) {
        setActiveCardId(null);
        const { active, over } = e;
        if (!over || !board) return;
        const activeType = active.data.current?.type;

        if (activeType === 'column') {
            if (active.id === over.id) return;
            const ids = board.columns.map((c) => c.id);
            const from = ids.indexOf(String(active.id));
            const to = ids.indexOf(String(over.id));
            if (from === -1 || to === -1) return;
            const next = arrayMove(ids, from, to);
            reorderColumnsMutation.mutate({ orderedIds: next });
            return;
        }

        if (activeType === 'card') {
            const cardId = String(active.id);
            const overType = over.data.current?.type;
            let toColumnId: string;
            let toIndex: number;

            if (overType === 'column') {
                toColumnId = String(over.id);
                toIndex = (grouped!.get(toColumnId) ?? []).filter((c) => c.id !== cardId).length;
            } else if (overType === 'card') {
                const overCard = board.cards.find((c) => c.id === over.id);
                if (!overCard) return;
                toColumnId = overCard.columnId;
                const targetList = (grouped!.get(toColumnId) ?? []).filter((c) => c.id !== cardId);
                toIndex = targetList.findIndex((c) => c.id === overCard.id);
                if (toIndex === -1) toIndex = targetList.length;
            } else {
                return;
            }

            const card = board.cards.find((c) => c.id === cardId);
            if (!card) return;
            if (card.columnId === toColumnId && card.order === toIndex) return;
            moveCardMutation.mutate({ cardId, toColumnId, toIndex });
        }
    }

    return (
        <div className="flex h-full flex-col">
            <BoardHeader board={board} />
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <main className="flex-1 overflow-x-auto overflow-y-hidden px-6 pb-6">
                    <SortableContext items={board.columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
                        <div className="flex h-full items-start gap-4">
                            {board.columns.map((column) => (
                                <Column
                                    key={column.id}
                                    column={column}
                                    cards={filteredById.get(column.id) ?? []}
                                    totalCount={(grouped.get(column.id) ?? []).length}
                                    board={board}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </main>
                <DragOverlay dropAnimation={null}>
                    {activeCard ? (
                        <div className="rotate-1 opacity-95">
                            <Card card={activeCard} board={board} dragging />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {cardDialogId ? <CardDialog board={board} cardId={cardDialogId} /> : null}
            {labelManagerOpen ? <LabelManager board={board} /> : null}
        </div>
    );
}
