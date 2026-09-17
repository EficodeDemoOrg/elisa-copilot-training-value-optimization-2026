import type { Board } from '@kanban/shared';
import { useFilters } from '../hooks/useFilters';
import { hasActiveFilters } from '../lib/board';
import { FilterPopover } from './FilterPopover';
import { useCreateColumn } from '../hooks/useBoard';
import { useUi } from '../store/ui';

export function BoardHeader({ board }: { board: Board }) {
    const [filters, update, reset] = useFilters();
    const createColumn = useCreateColumn();
    const setLabelManagerOpen = useUi((s) => s.setLabelManagerOpen);
    const active = hasActiveFilters(filters);

    function addColumn() {
        const name = prompt('New column name')?.trim();
        if (name) createColumn.mutate({ name });
    }

    return (
        <header className="flex items-center gap-3 px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-accent to-accent-pressed shadow-glow" />
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">{board.name}</h1>
                    <p className="text-xs text-ink-muted">
                        {board.columns.length} columns · {board.cards.length} cards
                    </p>
                </div>
            </div>
            <div className="ml-6 flex flex-1 items-center gap-2">
                <input
                    type="search"
                    value={filters.search}
                    onChange={(e) => update({ search: e.target.value })}
                    placeholder="Search cards…"
                    className="surface w-72 rounded-xl px-3 py-1.5 text-sm placeholder:text-ink-dim focus:border-accent"
                />
                <FilterPopover board={board} />
                {active && (
                    <button className="btn-ghost" onClick={reset}>
                        Clear filters
                    </button>
                )}
            </div>
            <div className="flex items-center gap-2">
                <button className="btn-ghost" onClick={() => setLabelManagerOpen(true)}>
                    Labels
                </button>
                <button className="btn-primary" onClick={addColumn}>
                    + Column
                </button>
            </div>
        </header>
    );
}
