import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import type { Board } from '@kanban/shared';
import { useDeleteCard, useUpdateCard } from '../hooks/useBoard';
import { useUi } from '../store/ui';
import clsx from 'clsx';

export function CardDialog({ board, cardId }: { board: Board; cardId: string }) {
    const closeCardDialog = useUi((s) => s.closeCardDialog);
    const card = board.cards.find((c) => c.id === cardId);
    const updateCard = useUpdateCard();
    const deleteCard = useDeleteCard();

    const [title, setTitle] = useState(card?.title ?? '');
    const [description, setDescription] = useState(card?.description ?? '');

    useEffect(() => {
        if (card) {
            setTitle(card.title);
            setDescription(card.description);
        }
    }, [card]);

    if (!card) return null;

    function commitTitle() {
        if (title.trim() && title !== card!.title) {
            updateCard.mutate({ id: card!.id, input: { title: title.trim() } });
        } else {
            setTitle(card!.title);
        }
    }
    function commitDescription() {
        if (description !== card!.description) {
            updateCard.mutate({ id: card!.id, input: { description } });
        }
    }
    function setLabel(labelId: string, on: boolean) {
        const next = on ? [...card!.labelIds, labelId] : card!.labelIds.filter((id) => id !== labelId);
        updateCard.mutate({ id: card!.id, input: { labelIds: next } });
    }
    function setAssignee(id: string | null) {
        updateCard.mutate({ id: card!.id, input: { assigneeId: id } });
    }
    function setDue(value: string) {
        updateCard.mutate({ id: card!.id, input: { dueDate: value || null } });
    }
    function remove() {
        if (confirm('Delete this card?')) {
            deleteCard.mutate(card!.id, { onSuccess: () => closeCardDialog() });
        }
    }

    const assignee = board.members.find((m) => m.id === card.assigneeId);

    return (
        <Dialog.Root open onOpenChange={(open) => !open && closeCardDialog()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
                <Dialog.Content className="surface-elevated fixed left-1/2 top-1/2 z-50 w-[min(640px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-card focus:outline-none">
                    <Dialog.Title asChild>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={commitTitle}
                            className="w-full bg-transparent text-xl font-semibold tracking-tight text-ink focus:outline-none"
                        />
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-xs text-ink-dim">
                        Updated {new Date(card.updatedAt).toLocaleString()}
                    </Dialog.Description>

                    <div className="mt-4 grid grid-cols-[1fr,180px] gap-6">
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-ink-dim">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={commitDescription}
                                rows={6}
                                className="surface mt-1 w-full resize-y rounded-xl px-3 py-2 text-sm placeholder:text-ink-dim"
                                placeholder="Add more detail…"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-ink-dim">
                                    Labels
                                </div>
                                <Popover.Root>
                                    <Popover.Trigger asChild>
                                        <button className="btn-ghost w-full justify-start">
                                            {card.labelIds.length ? `${card.labelIds.length} selected` : 'Add labels'}
                                        </button>
                                    </Popover.Trigger>
                                    <Popover.Portal>
                                        <Popover.Content
                                            sideOffset={6}
                                            className="surface-elevated z-50 max-h-64 w-56 overflow-y-auto rounded-xl p-2 text-sm shadow-card"
                                        >
                                            {board.labels.map((l) => {
                                                const on = card.labelIds.includes(l.id);
                                                return (
                                                    <button
                                                        key={l.id}
                                                        onClick={() => setLabel(l.id, !on)}
                                                        className={clsx(
                                                            'flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-white/5',
                                                            on && 'bg-white/5',
                                                        )}
                                                    >
                                                        <span className="h-3 w-3 rounded" style={{ background: l.color }} />
                                                        <span className="flex-1 truncate">{l.name}</span>
                                                        {on && <span className="text-accent">✓</span>}
                                                    </button>
                                                );
                                            })}
                                            {board.labels.length === 0 && (
                                                <div className="px-2 py-1 text-xs text-ink-dim">No labels yet</div>
                                            )}
                                        </Popover.Content>
                                    </Popover.Portal>
                                </Popover.Root>
                            </div>

                            <div>
                                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-ink-dim">
                                    Assignee
                                </div>
                                <Popover.Root>
                                    <Popover.Trigger asChild>
                                        <button className="btn-ghost w-full justify-start">
                                            {assignee ? assignee.name : 'Unassigned'}
                                        </button>
                                    </Popover.Trigger>
                                    <Popover.Portal>
                                        <Popover.Content
                                            sideOffset={6}
                                            className="surface-elevated z-50 w-56 rounded-xl p-2 text-sm shadow-card"
                                        >
                                            <button
                                                onClick={() => setAssignee(null)}
                                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-white/5"
                                            >
                                                Unassigned
                                            </button>
                                            {board.members.map((m) => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => setAssignee(m.id)}
                                                    className={clsx(
                                                        'flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-white/5',
                                                        card.assigneeId === m.id && 'bg-white/5',
                                                    )}
                                                >
                                                    <span
                                                        className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                                                        style={{ background: m.color }}
                                                    >
                                                        {m.initials}
                                                    </span>
                                                    <span className="flex-1 truncate">{m.name}</span>
                                                </button>
                                            ))}
                                        </Popover.Content>
                                    </Popover.Portal>
                                </Popover.Root>
                            </div>

                            <div>
                                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-ink-dim">
                                    Due date
                                </div>
                                <input
                                    type="date"
                                    value={card.dueDate ?? ''}
                                    onChange={(e) => setDue(e.target.value)}
                                    className="surface w-full rounded-xl px-3 py-1.5 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <button className="btn-ghost text-danger hover:text-danger" onClick={remove}>
                            Delete card
                        </button>
                        <Dialog.Close asChild>
                            <button className="btn-primary">Done</button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
