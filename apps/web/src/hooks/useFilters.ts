import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { BoardFilters } from '../lib/board';
import { emptyFilters } from '../lib/board';

const KEYS = ['q', 'labels', 'assignees', 'overdue'] as const;

export function useFilters(): [BoardFilters, (next: Partial<BoardFilters>) => void, () => void] {
    const [params, setParams] = useSearchParams();

    const filters = useMemo<BoardFilters>(() => {
        return {
            search: params.get('q') ?? '',
            labelIds: (params.get('labels') ?? '').split(',').filter(Boolean),
            assigneeIds: (params.get('assignees') ?? '').split(',').filter(Boolean),
            onlyOverdue: params.get('overdue') === '1',
        };
    }, [params]);

    const update = useCallback(
        (next: Partial<BoardFilters>) => {
            const merged = { ...filters, ...next };
            const sp = new URLSearchParams(params);
            if (merged.search) sp.set('q', merged.search); else sp.delete('q');
            if (merged.labelIds.length) sp.set('labels', merged.labelIds.join(',')); else sp.delete('labels');
            if (merged.assigneeIds.length) sp.set('assignees', merged.assigneeIds.join(',')); else sp.delete('assignees');
            if (merged.onlyOverdue) sp.set('overdue', '1'); else sp.delete('overdue');
            setParams(sp, { replace: true });
        },
        [filters, params, setParams],
    );

    const reset = useCallback(() => {
        const sp = new URLSearchParams(params);
        KEYS.forEach((k) => sp.delete(k));
        setParams(sp, { replace: true });
    }, [params, setParams]);

    return [filters, update, reset];
}

export { emptyFilters };
