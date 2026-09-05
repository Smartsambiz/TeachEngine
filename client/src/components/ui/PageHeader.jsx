export default function PageHeader({ eyebrow, title, description, action }) {
    return <header className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{eyebrow}</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{title}</h1>{description && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}</div>{action}</header>;
}
