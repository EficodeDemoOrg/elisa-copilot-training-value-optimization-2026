import * as Popover from '@radix-ui/react-popover';
import type { Board } from '@kanban/shared';
import { useFilters } from '../hooks/useFilters';
import clsx from 'clsx';

function toggle<T>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function FilterPopover({ board }: { board: Board }) {
    const [filters, update] = useFilters();
    const activeCount =
        filters.labelIds.length + filters.assigneeIds.length + (filters.onlyOverdue ? 1 : 0);

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button className="btn-ghost">
                    Filter
                    {activeCount > 0 && (
                        <span className="chip bg-accent text-white">{activeCount}</span>
                    )}
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    sideOffset={6}
                    className="surface-elevated z-50 w-72 rounded-xl p-3 text-sm shadow-card"
                >
                    <div className="mb-3">
                        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-ink-dim">
                            Labels
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {board.labels.map((l) => {
                                const on = filters.labelIds.includes(l.id);
                                return (
                                    <button
                                        key={l.id}
                                        onClick={() => update({ labelIds: toggle(filters.labelIds, l.id) })}
                                        className={clsx(
                                            'chip border border-transparent',
                                            on ? 'text-white' : 'text-ink-muted',
                                        )}
                                        style={on ? { background: l.color } : { background: 'rgba(255,255,255,0.05)' }}
                                    >
                                        {l.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-ink-dim">
                            Assignees
                        </div>
                        <div className="flex flex-col gap-1">
                            {board.members.map((m) => {
                                const on = filters.assigneeIds.includes(m.id);
                                return (
                                    <label
                                        key={m.id}
                                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/5"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={on}
                                            onChange={() => update({ assigneeIds: toggle(filters.assigneeIds, m.id) })}
                                            className="accent-accent"
                                        />
                                        <span
                                            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                                            style={{ background: m.color }}
                                        >
                                            {m.initials}
                                        </span>
                                        <span>{m.name}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/5">
                        <input
                            type="checkbox"
                            checked={filters.onlyOverdue}
                            onChange={(e) => update({ onlyOverdue: e.target.checked })}
                            className="accent-accent"
                        />
                        <span>Only overdue</span>
                    </label>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
