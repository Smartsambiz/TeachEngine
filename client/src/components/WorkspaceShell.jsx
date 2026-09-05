import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ArrowLeft, BookOpen, ChevronDown, Files, Grid3X3, LogOut, Settings, UserRound } from "lucide-react";

const navigation = [
    { label: "Dashboard", href: "/dashboard", icon: Grid3X3, match: ["/dashboard"] },
    { label: "Classes", href: "/dashboard#classes", icon: BookOpen, match: ["/classes", "/subjects"] },
    { label: "Schemes", href: "/dashboard#schemes", icon: Files, match: ["/schemes", "/topics"] },
];

const isActiveRoute = (item, pathname) => item.match.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export default function WorkspaceShell({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logoutUser } = useAuth();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    const canGoBack = location.pathname !== "/dashboard";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="sticky top-0 z-20 hidden border-b border-slate-200 bg-white/95 backdrop-blur md:block">
                <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4">
                    <Link to="/dashboard" className="flex shrink-0 items-center gap-2 text-lg font-bold text-slate-900 no-underline">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-800 text-sm text-white">T</span>
                        TeachEngine
                    </Link>

                    <nav aria-label="Primary navigation" className="flex h-full items-center gap-6">
                        {navigation.map((item) => {
                            const active = isActiveRoute(item, location.pathname);
                            return (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={`flex h-full items-center border-b-2 px-1 text-sm font-semibold no-underline transition ${active ? "border-amber-800 text-amber-800" : "border-transparent text-slate-600 hover:text-slate-900"}`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {canGoBack && <button type="button" onClick={() => navigate(-1)} className="ml-auto inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><ArrowLeft size={16} aria-hidden="true" />Back</button>}
                    <details className={`${canGoBack ? "" : "ml-auto"} group relative`}>
                        <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-xs text-amber-800">
                                {(user?.name || "T").slice(0, 1).toUpperCase()}
                            </span>
                            <ChevronDown size={16} aria-hidden="true" className="text-slate-400 transition group-open:rotate-180" />
                        </summary>
                        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                            <div className="border-b border-slate-100 px-3 py-2">
                                <p className="truncate text-sm font-semibold text-slate-900">{user?.name || "Teacher"}</p>
                                <p className="text-xs text-slate-500">Profile</p>
                            </div>
                            <button type="button" className="mt-2 flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                <Settings size={16} aria-hidden="true" />
                                Settings
                            </button>
                            <button type="button" onClick={handleLogout} className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                <LogOut size={16} aria-hidden="true" />
                                Sign out
                            </button>
                        </div>
                    </details>
                </div>
            </header>

            <header className="flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 md:hidden">
                <div className="flex min-w-0 items-center gap-2">
                    <Link to="/dashboard" className="truncate text-lg font-bold text-slate-900 no-underline">TeachEngine</Link>
                    {canGoBack && <button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"><ArrowLeft size={18} aria-hidden="true" /></button>}
                </div>
                <button type="button" onClick={handleLogout} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><LogOut size={16} aria-hidden="true" />Sign out</button>
            </header>
            <main className="pb-28 md:pb-10">{children}</main>

            <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
                <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
                    {navigation.map((item) => {
                        const active = isActiveRoute(item, location.pathname);
                        const Icon = item.icon;
                        return (
                            <Link key={item.label} to={item.href} className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold no-underline ${active ? "text-amber-800" : "text-slate-400"}`}>
                                <Icon size={19} aria-hidden="true" />
                                {item.label}
                            </Link>
                        );
                    })}
                    <details className="group relative">
                        <summary className="flex min-h-11 cursor-pointer list-none flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold text-slate-400">
                            <UserRound size={19} aria-hidden="true" />
                            Profile
                        </summary>
                        <div className="absolute bottom-full right-0 mb-3 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                            <p className="truncate border-b border-slate-100 px-3 py-2 text-sm font-semibold text-slate-900">{user?.name || "Teacher"}</p>
                            <button type="button" className="mt-2 flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                <Settings size={16} aria-hidden="true" />
                                Settings
                            </button>
                            <button type="button" onClick={handleLogout} className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                <LogOut size={16} aria-hidden="true" />
                                Sign out
                            </button>
                        </div>
                    </details>
                </div>
            </nav>
        </div>
    );
}
