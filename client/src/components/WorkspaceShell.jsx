import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const navigation = [
    { label: "Dashboard", href: "/dashboard", icon: "grid" },
    { label: "Classes", href: "/dashboard", icon: "book" },
];

function NavIcon({ name }) {
    if (name === "book") {
        return <span aria-hidden="true">▣</span>;
    }
    return <span aria-hidden="true">▦</span>;
}

export default function WorkspaceShell({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logoutUser } = useAuth();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
            <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
                <div className="flex h-20 items-center border-b border-slate-100 px-6">
                    <Link to="/dashboard" className="text-xl font-bold tracking-tight text-slate-900 no-underline">TeachEngine</Link>
                </div>
                <div className="flex-1 px-4 py-8">
                    <p className="px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
                    <nav aria-label="Workspace navigation" className="mt-3 space-y-1">
                        {navigation.map((item) => {
                            const active = item.href === "/dashboard" && location.pathname === "/dashboard";
                            return <Link key={item.label} to={item.href} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold no-underline transition ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><NavIcon name={item.icon} />{item.label}</Link>;
                        })}
                    </nav>
                    <p className="mt-8 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Planning path</p>
                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-500">Class → Subject → Scheme → Topic → Lesson note</div>
                </div>
                <div className="border-t border-slate-100 p-4">
                    <p className="truncate px-3 text-sm font-semibold text-slate-700">{user?.name || "Teacher"}</p>
                    <button type="button" onClick={handleLogout} className="mt-3 min-h-11 w-full rounded-lg px-3 text-left text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">Sign out</button>
                </div>
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:hidden">
                    <div className="flex min-h-16 items-center justify-between gap-3">
                        <Link to="/dashboard" className="text-lg font-bold text-slate-900 no-underline">TeachEngine</Link>
                        <button type="button" onClick={handleLogout} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-slate-500 hover:bg-slate-50">Sign out</button>
                    </div>
                </header>
                <main className="pb-24 lg:pb-10">{children}</main>
                <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur lg:hidden">
                    <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
                        {navigation.map((item) => {
                            const active = item.href === "/dashboard" && location.pathname === "/dashboard";
                            return <Link key={item.label} to={item.href} className={`flex min-h-11 flex-col items-center justify-center rounded-lg text-xs font-semibold no-underline ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}><NavIcon name={item.icon} />{item.label}</Link>;
                        })}
                    </div>
                </nav>
            </div>
        </div>
    );
}
