import { create } from 'zustand';

export interface ToastMessage {
    id: number;
    title: string;
    description?: string;
    tone?: 'default' | 'danger';
}

interface UiState {
    cardDialogId: string | null;
    openCardDialog: (id: string) => void;
    closeCardDialog: () => void;

    labelManagerOpen: boolean;
    setLabelManagerOpen: (open: boolean) => void;

    toasts: ToastMessage[];
    pushToast: (t: Omit<ToastMessage, 'id'>) => void;
    dismissToast: (id: number) => void;
}

let toastCounter = 0;

export const useUi = create<UiState>((set) => ({
    cardDialogId: null,
    openCardDialog: (id) => set({ cardDialogId: id }),
    closeCardDialog: () => set({ cardDialogId: null }),

    labelManagerOpen: false,
    setLabelManagerOpen: (open) => set({ labelManagerOpen: open }),

    toasts: [],
    pushToast: (t) =>
        set((s) => ({ toasts: [...s.toasts, { ...t, id: ++toastCounter }] })),
    dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
