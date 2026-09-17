import { describe, expect, it } from 'vitest';
import type { Card } from '@kanban/shared';
import { filterCards, emptyFilters } from './board';

const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);

const cards: Card[] = [
    { id: '1', columnId: 'a', title: 'Foo Bar', description: 'design notes', labelIds: ['l1'], assigneeId: 'u1', dueDate: yesterday, order: 0, createdAt: '', updatedAt: '' },
    { id: '2', columnId: 'a', title: 'Baz', description: 'about FOO', labelIds: ['l2'], order: 1, createdAt: '', updatedAt: '' },
    { id: '3', columnId: 'a', title: 'Qux', description: '', labelIds: [], dueDate: today, order: 2, createdAt: '', updatedAt: '' },
];

describe('filterCards', () => {
    it('returns all with no filters', () => {
        expect(filterCards(cards, emptyFilters)).toHaveLength(3);
    });
    it('matches search across title and description, case-insensitive', () => {
        expect(filterCards(cards, { ...emptyFilters, search: 'foo' }).map((c) => c.id)).toEqual(['1', '2']);
    });
    it('filters by labels (any match)', () => {
        expect(filterCards(cards, { ...emptyFilters, labelIds: ['l2'] }).map((c) => c.id)).toEqual(['2']);
    });
    it('filters by assignee', () => {
        expect(filterCards(cards, { ...emptyFilters, assigneeIds: ['u1'] }).map((c) => c.id)).toEqual(['1']);
    });
    it('only overdue excludes today and future', () => {
        expect(filterCards(cards, { ...emptyFilters, onlyOverdue: true }).map((c) => c.id)).toEqual(['1']);
    });
    it('combines search and label filters', () => {
        expect(filterCards(cards, { ...emptyFilters, search: 'foo', labelIds: ['ll2'] }).map((c) => c.id)).toEqual(['2']);
    });
});
