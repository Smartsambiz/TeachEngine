export default function EmptyState({ title, description, action }) {
    return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center"><h2 className="text-base font-semibold text-slate-900">{title}</h2>{description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>}{action && <div className="mt-5">{action}</div>}</div>;
}
