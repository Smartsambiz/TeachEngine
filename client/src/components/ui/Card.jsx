export default function Card({ as: Component = "div", interactive = false, className = "", children, ...props }) {
    return <Component className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${interactive ? "transition hover:border-slate-300 hover:shadow-md" : ""} ${className}`} {...props}>{children}</Component>;
}
