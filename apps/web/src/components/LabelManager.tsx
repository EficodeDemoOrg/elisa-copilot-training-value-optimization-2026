import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Board } from '@kanban/shared';
import { useCreateLabel, useDeleteLabel, useUpdateLabel } from '../hooks/useBoard';
import { useUi } from '../store/ui';

const PALETTE = ['#E6398A', '#FF6FB3', '#3DDC97', '#F2C14E', '#FF5A6E', '#A4ABC9', '#7C8CFF', '#48C7D6'];

export function LabelManager({ board }: { board: Board }) {
    const setOpen = useUi((s) => s.setLabelManagerOpen);
    const createLabel = useCreateLabel();
    const updateLabel = useUpdateLabel();
    const deleteLabel = useDeleteLabel();
    const [newName, setNewName] = useState('');
    const [newColor, setNewColor] = useState(PALETTE[0]);

    function addLabel() {
        const name = newName.trim();
        if (!name) return;
        createLabel.mutate({ name, color: newColor }, { onSuccess: () => setNewName('') });
    }

    return (
        <Dialog.Root open onOpenChange={(open) => !open && setOpen(false)}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
                <Dialog.Content className="surface-elevated fixed left-1/2 top-1/2 z-50 w-[min(480px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-card focus:outline-none">
                    <Dialog.Title className="text-lg font-semibold">Labels</Dialog.Title>
                    <Dialog.Description className="mt-1 text-xs text-ink-dim">
                        Categorize cards. Deleting a label removes it from all cards.
                    </Dialog.Description>

                    <ul className="mt-4 flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
                        {board.labels.map((l) => (
                            <li key={l.id} className="surface flex items-center gap-2 rounded-xl px-2 py-1">
                                <input
                                    type="color"
                                    value={l.color}
                                    onChange={(e) =>
                                        updateLabel.mutate({ id: l.id, input: { color: e.target.value } })
                                    }
                                    className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent"
                                    aria-label={`Color for ${l.name}`}
                                />
                                <input
                                    defaultValue={l.name}
                                    onBlur={(e) => {
                                        const v = e.target.value.trim();
                                        if (v && v !== l.name) updateLabel.mutate({ id: l.id, input: { name: v } });
                                    }}
                                    className="flex-1 bg-transparent px-2 py-1 text-sm focus:outline-none"
                                />
                                <button
                                    className="btn-ghost text-danger hover:text-danger"
                                    onClick={() => deleteLabel.mutate(l.id)}
                                    aria-label={`Delete ${l.name}`}
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                        {board.labels.length === 0 && (
                            <li className="text-xs text-ink-dim">No labels yet — create one below.</li>
                        )}
                    </ul>

                    <div className="mt-4 flex items-center gap-2">
                        <input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addLabel()}
                            placeholder="New label name"
                            className="surface flex-1 rounded-xl px-3 py-1.5 text-sm placeholder:text-ink-dim"
                        />
                        <div className="flex gap-1">
                            {PALETTE.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setNewColor(c)}
                                    className="h-6 w-6 rounded-full border border-white/10"
                                    style={{ background: c, outline: c === newColor ? '2px solid white' : 'none' }}
                                    aria-label={`Color ${c}`}
                                />
                            ))}
                        </div>
                        <button className="btn-primary" onClick={addLabel}>
                            Add
                        </button>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Dialog.Close asChild>
                            <button className="btn-ghost">Close</button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
