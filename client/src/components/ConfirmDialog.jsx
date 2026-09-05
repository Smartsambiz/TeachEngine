import { createPortal } from "react-dom";

export default function ConfirmDialog({ title, message, confirmLabel = "Delete", busy = false, onCancel, onConfirm }) {
    return createPortal(
        <div
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.65)' }}
            className="flex items-center justify-center p-4 backdrop-blur-sm"
            role="presentation"
            onClick={onCancel}
        >
            <div role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                <h2 id="confirm-dialog-title" className="text-lg font-semibold text-slate-900">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button type="button" onClick={onCancel} disabled={busy} className="min-h-11 cursor-pointer rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button type="button" onClick={onConfirm} disabled={busy} className="min-h-11 cursor-pointer rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Deleting..." : confirmLabel}</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
