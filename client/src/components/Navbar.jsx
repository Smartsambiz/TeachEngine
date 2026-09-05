import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const pageNames = {
    "/dashboard": "Dashboard",
    "/classes": "Class workspace",
    "/subjects": "Subject workspace",
    "/schemes": "Scheme planner",
    "/topics": "Lesson note",
};

function getPageName(pathname) {
    const match = Object.keys(pageNames).find((path) => pathname.startsWith(path));
    return match ? pageNames[match] : "Curriculum workspace";
}

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, logoutUser } = useAuth();
    const isDashboard = location.pathname === "/dashboard";

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <header className="mb-8 border-b border-slate-800 pb-3 sm:mb-12 sm:pb-4">
            <div className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-3 sm:min-h-16 sm:gap-4">
                <div className="flex min-w-0 items-center gap-2 sm:gap-4">
                    <Link to={token ? "/dashboard" : "/login"} className="shrink-0 text-lg font-black text-indigo-300 no-underline sm:text-xl">
                        TeachEngine
                    </Link>
                    <span className="hidden h-5 w-px bg-slate-700 sm:block" aria-hidden="true" />
                    <span className="hidden truncate text-sm text-slate-400 sm:block">{getPageName(location.pathname)}</span>
                </div>

                <nav aria-label="Primary navigation" className="flex items-center gap-1 sm:gap-2">
                    {token ? (
                        <>
                            {!isDashboard && (
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="min-h-11 rounded-lg px-2 text-xs font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 sm:px-3 sm:text-sm"
                                >
                                    <span aria-hidden="true">←</span><span className="ml-1 hidden sm:inline">Back</span>
                                </button>
                            )}
                            <Link to="/dashboard" className="min-h-11 rounded-lg px-2 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-slate-100 no-underline sm:px-3 sm:text-sm">
                                Dashboard
                            </Link>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="min-h-11 rounded-lg border border-slate-700 px-2 py-2 text-xs font-semibold text-slate-400 transition hover:border-indigo-500 hover:text-indigo-300 sm:px-3 sm:text-sm"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="min-h-11 rounded-lg px-2 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-slate-100 no-underline sm:px-3 sm:text-sm">Log in</Link>
                            <Link to="/register" className="min-h-11 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white no-underline transition hover:bg-indigo-500 sm:px-4 sm:text-sm">Create account</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
