import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useAuth } from "../context/authContext";

const pageNames = {
    "/dashboard": "Dashboard",
    "/classes": "Class workspace",
    "/subjects": "Subject workspace",
    "/schemes": "Scheme planner",
    "/topics": "Lesson note",
};

const navigation = [
    { label: "Dashboard", href: "/dashboard", match: ["/dashboard"] },
    { label: "Classes", href: "/dashboard#classes", match: ["/classes", "/subjects"] },
    { label: "Schemes", href: "/dashboard#schemes", match: ["/schemes", "/topics"] },
];

function getPageName(pathname) {
    const match = Object.keys(pageNames).find((path) => pathname.startsWith(path));
    return match ? pageNames[match] : "Curriculum workspace";
}

const isActiveRoute = (item, pathname) => item.match.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, logoutUser } = useAuth();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <header className="app-header mb-8 border-b border-slate-200 sm:mb-10">
            <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4">
                <div className="flex min-w-0 items-center gap-4">
                    <Link to={token ? "/dashboard" : "/login"} className="flex shrink-0 items-center gap-2 text-lg font-bold text-slate-900 no-underline">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-800 text-sm text-white">T</span>
                        TeachEngine
                    </Link>
                    <span className="hidden h-5 w-px bg-slate-200 sm:block" aria-hidden="true" />
                    <span className="hidden truncate text-sm text-slate-500 sm:block">{getPageName(location.pathname)}</span>
                </div>

                {token ? (
                    <>
                        <nav aria-label="Primary navigation" className="hidden h-16 items-center gap-6 md:flex">
                            {navigation.map((item) => {
                                const active = isActiveRoute(item, location.pathname);
                                return (
                                    <Link key={item.label} to={item.href} className={`flex h-full items-center border-b-2 px-1 text-sm font-semibold no-underline transition ${active ? "border-amber-800 text-amber-800" : "border-transparent text-slate-600 hover:text-slate-900"}`}>
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        <details className="group relative">
                            <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-xs text-amber-800">T</span>
                                <ChevronDown size={16} aria-hidden="true" className="text-slate-400 transition group-open:rotate-180" />
                            </summary>
                            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                                <button type="button" className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                    <Settings size={16} aria-hidden="true" />
                                    Settings
                                </button>
                                <button type="button" onClick={handleLogout} className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                    <LogOut size={16} aria-hidden="true" />
                                    Sign out
                                </button>
                            </div>
                        </details>
                    </>
                ) : (
                    <nav aria-label="Primary navigation" className="flex items-center gap-2">
                        <Link to="/login" className="flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 no-underline transition hover:bg-slate-100 hover:text-slate-900">Log in</Link>
                        <Link to="/register" className="flex min-h-10 items-center rounded-lg bg-amber-800 px-4 py-2 text-sm font-semibold text-white no-underline transition hover:bg-amber-900">Create account</Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
