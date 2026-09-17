import * as Toast from '@radix-ui/react-toast';
import { useUi } from '../store/ui';

export function ToastHost() {
    const toasts = useUi((s) => s.toasts);
    const dismiss = useUi((s) => s.dismissToast);

    return (
        <Toast.Provider swipeDirection="right" duration={5000}>
            {toasts.map((t) => (
                <Toast.Root
                    key={t.id}
                    onOpenChange={(open) => !open && dismiss(t.id)}
                    className={
                        'surface-elevated data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out grid grid-cols-[1fr_auto] items-start gap-3 rounded-xl p-3 shadow-card ' +
                        (t.tone === 'danger' ? 'border-danger/40' : '')
                    }
                >
                    <div>
                        <Toast.Title className="text-sm font-semibold text-ink">{t.title}</Toast.Title>
                        {t.description && (
                            <Toast.Description className="text-xs text-ink-muted">{t.description}</Toast.Description>
                        )}
                    </div>
                    <Toast.Close className="btn-ghost text-xs">Dismiss</Toast.Close>
                </Toast.Root>
            ))}
            <Toast.Viewport className="fixed bottom-4 right-4 z-[60] flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none" />
        </Toast.Provider>
    );
}
