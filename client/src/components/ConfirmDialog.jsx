import { createPortal } from "react-dom";

export default function ConfirmDialog({ title, message, confirmLabel = "Delete", busy = false, onCancel, onConfirm }) {
    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
            role="presentation"
            onClick={onCancel}
        >
            <div role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
                <h2 id="confirm-dialog-title" className="text-lg font-semibold text-slate-900">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button type="button" onClick={onCancel} disabled={busy} className="min-h-11 cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:min-h-10">Cancel</button>
                    <button type="button" onClick={onConfirm} disabled={busy} className="min-h-11 cursor-pointer rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-10">{busy ? "Deleting..." : confirmLabel}</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
