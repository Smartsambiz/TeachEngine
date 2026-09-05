import { Link } from "react-router-dom";

export default function HierarchyBreadcrumb({ items = [] }) {
    return <nav aria-label="Teaching path" className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">{items.map((item, index) => <span key={`${item.label}-${index}`} className="flex items-center gap-2"><span className={index === items.length - 1 ? "font-semibold text-slate-900" : ""}>{item.href ? <Link to={item.href} className="no-underline hover:text-indigo-600">{item.label}</Link> : item.label}</span>{index < items.length - 1 && <span aria-hidden="true">/</span>}</span>)}</nav>;
}
