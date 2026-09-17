import type { Board, Card as CardType } from '@kanban/shared';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { useUi } from '../store/ui';

interface Props {
    card: CardType;
    board: Board;
    dragging?: boolean;
}

function isOverdue(dueDate: string | undefined): boolean {
    if (!dueDate) return false;
    return dueDate < new Date().toISOString().slice(0, 10);
}

function formatDue(dueDate: string): string {
    const d = new Date(dueDate);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function Card({ card, board, dragging }: Props) {
    const openCardDialog = useUi((s) => s.openCardDialog);
    const sortable = useSortable({ id: card.id, data: { type: 'card' }, disabled: dragging });
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable;

    const labels = board.labels.filter((l) => card.labelIds.includes(l.id));
    const assignee = board.members.find((m) => m.id === card.assigneeId);
    const overdue = isOverdue(card.dueDate);

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <article
            ref={dragging ? undefined : setNodeRef}
            style={dragging ? undefined : style}
            {...(dragging ? {} : attributes)}
            {...(dragging ? {} : listeners)}
            onClick={() => !dragging && openCardDialog(card.id)}
            onKeyDown={(e) => {
                if (!dragging && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    openCardDialog(card.id);
                }
            }}
            tabIndex={0}
            className={clsx(
                'surface-elevated group cursor-pointer rounded-xl p-3 text-left text-sm shadow-card transition-colors hover:border-accent/30',
            )}
        >
            {labels.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                    {labels.map((l) => (
                        <span
                            key={l.id}
                            className="chip text-white/95"
                            style={{ background: l.color }}
                        >
                            {l.name}
                        </span>
                    ))}
                </div>
            )}
            <h3 className="font-medium leading-snug text-ink">{card.title}</h3>
            {card.description && (
                <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{card.description}</p>
            )}
            <footer className="mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-ink-dim">
                    {card.dueDate && (
                        <span className={clsx('chip', overdue ? 'bg-danger/20 text-danger' : 'bg-white/5 text-ink-muted')}>
                            {overdue ? '⚠ ' : '📅 '}
                            {formatDue(card.dueDate)}
                        </span>
                    )}
                </div>
                {assignee && (
                    <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                        style={{ background: assignee.color }}
                        title={assignee.name}
                    >
                        {assignee.initials}
                    </span>
                )}
            </footer>
        </article>
    );
}
