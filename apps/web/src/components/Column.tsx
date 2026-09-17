import { useState } from 'react';
import clsx from 'clsx';
import type { Board, Column as ColumnType, Card as CardType } from '@kanban/shared';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Card } from './Card';
import { useCreateCard, useDeleteColumn, useUpdateColumn } from '../hooks/useBoard';

interface Props {
    column: ColumnType;
    cards: CardType[];
    totalCount: number;
    board: Board;
}

export function Column({ column, cards, totalCount, board }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: { type: 'column' },
    });
    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: column.id,
        data: { type: 'column' },
    });
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const createCard = useCreateCard();
    const updateColumn = useUpdateColumn();
    const deleteColumn = useDeleteColumn();

    const overLimit = column.wipLimit != null && totalCount > column.wipLimit;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    function submitCard() {
        const t = newTitle.trim();
        if (!t) {
            setIsAdding(false);
            return;
        }
        createCard.mutate(
            { columnId: column.id, title: t },
            {
                onSuccess: () => {
                    setNewTitle('');
                    setIsAdding(false);
                },
            },
        );
    }

    function rename() {
        const name = prompt('Rename column', column.name)?.trim();
        if (name && name !== column.name) updateColumn.mutate({ id: column.id, input: { name } });
    }

    function setLimit() {
        const raw = prompt(
            'WIP limit (leave blank to clear)',
            column.wipLimit != null ? String(column.wipLimit) : '',
        );
        if (raw === null) return;
        const trimmed = raw.trim();
        if (!trimmed) {
            updateColumn.mutate({ id: column.id, input: { wipLimit: null } });
            return;
        }
        const n = Number(trimmed);
        if (Number.isInteger(n) && n > 0) {
            updateColumn.mutate({ id: column.id, input: { wipLimit: n } });
        }
    }

    function remove() {
        if (confirm(`Delete column "${column.name}" and ${totalCount} card(s)?`)) {
            deleteColumn.mutate(column.id);
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx(
                'flex h-full w-80 shrink-0 flex-col rounded-2xl surface shadow-card',
                isOver && 'ring-1 ring-accent/60',
            )}
        >
            <header
                className={clsx(
                    'flex items-center gap-2 rounded-t-2xl px-3 py-2',
                    overLimit ? 'bg-accent/15 text-ink' : 'text-ink-muted',
                )}
            >
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab select-none rounded p-1 text-ink-dim hover:bg-white/5 active:cursor-grabbing"
                    aria-label="Drag column"
                >
                    ⋮⋮
                </button>
                <h2 className="flex-1 truncate text-sm font-semibold uppercase tracking-wide text-ink">
                    {column.name}
                </h2>
                <span
                    className={clsx(
                        'chip',
                        overLimit ? 'bg-accent text-white' : 'bg-white/5 text-ink-muted',
                    )}
                    title={column.wipLimit != null ? `WIP limit ${column.wipLimit}` : 'No WIP limit'}
                >
                    {totalCount}
                    {column.wipLimit != null ? ` / ${column.wipLimit}` : ''}
                </span>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className="rounded p-1 text-ink-dim hover:bg-white/5 hover:text-ink" aria-label="Column menu">
                            …
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            align="end"
                            sideOffset={6}
                            className="surface-elevated z-50 min-w-44 rounded-xl p-1 text-sm shadow-card"
                        >
                            <DropdownMenu.Item onSelect={rename} className="cursor-pointer rounded-lg px-3 py-1.5 outline-none hover:bg-white/5">
                                Rename
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onSelect={setLimit} className="cursor-pointer rounded-lg px-3 py-1.5 outline-none hover:bg-white/5">
                                Set WIP limit…
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onSelect={() => setIsAdding(true)} className="cursor-pointer rounded-lg px-3 py-1.5 outline-none hover:bg-white/5">
                                Add card
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-1 h-px bg-white/5" />
                            <DropdownMenu.Item onSelect={remove} className="cursor-pointer rounded-lg px-3 py-1.5 text-danger outline-none hover:bg-danger/10">
                                Delete column
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </header>

            {overLimit && (
                <div className="mx-3 mb-2 rounded-lg bg-accent/10 px-2 py-1 text-xs text-accent-hover">
                    Over WIP limit by {totalCount - (column.wipLimit ?? 0)}
                </div>
            )}

            <div ref={setDropRef} className="flex-1 overflow-y-auto px-2 pb-2">
                <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-2">
                        {cards.map((card) => (
                            <Card key={card.id} card={card} board={board} />
                        ))}
                        {cards.length === 0 && (
                            <div className="rounded-xl border border-dashed border-white/5 px-3 py-6 text-center text-xs text-ink-dim">
                                No cards
                            </div>
                        )}
                    </div>
                </SortableContext>
            </div>

            <div className="p-2">
                {isAdding ? (
                    <div className="flex flex-col gap-2">
                        <textarea
                            autoFocus
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    submitCard();
                                }
                                if (e.key === 'Escape') setIsAdding(false);
                            }}
                            placeholder="Card title…"
                            className="surface min-h-[64px] resize-none rounded-xl px-3 py-2 text-sm placeholder:text-ink-dim"
                        />
                        <div className="flex gap-2">
                            <button className="btn-primary" onClick={submitCard}>
                                Add
                            </button>
                            <button className="btn-ghost" onClick={() => setIsAdding(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button className="btn-ghost w-full justify-center" onClick={() => setIsAdding(true)}>
                        + Add card
                    </button>
                )}
            </div>
        </div>
    );
}
