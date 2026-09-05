import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const { loginUser } = useAuth(); // Import our global login actions hook
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await API.post("/auth/login", formData);
            
            // Extract session token string from response payload
            const token = response.data.session;
            const profile = { email: formData.email, name: "Teacher" }; // Standard profile mock placeholder
            
            // Lock into global Context memory + local storage!
            loginUser(token, profile);
            
            // Push them straight through to the master dashboard panel
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error?.message || "Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-950 p-4 font-sans text-slate-100 sm:p-6 md:p-10">
            <Navbar />
            <main className="flex min-h-[calc(100vh-6rem)] items-center justify-center py-8 sm:py-12">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
                <section className="hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">Your teaching desk</p>
                        <h1 className="mt-8 max-w-lg text-4xl font-black leading-tight tracking-tight text-white xl:text-5xl">Plan less admin. Teach with more intention.</h1>
                        <p className="mt-6 max-w-md text-base leading-7 text-slate-300">TeachEngine keeps your classes, weekly schemes, objectives, and lesson notes together so your best thinking is easy to find.</p>
                        <div className="mt-10 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-200"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">1</span>Organise every class in one workspace</div>
                            <div className="flex items-center gap-3 text-sm text-slate-200"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">2</span>Turn objectives into weekly teaching plans</div>
                            <div className="flex items-center gap-3 text-sm text-slate-200"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">3</span>Keep lesson notes ready for the classroom</div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-400">A quieter way to prepare meaningful lessons.</p>
                </section>

                <section className="bg-slate-900 p-6 sm:p-10 lg:p-12">
                    <div className="mb-8 lg:hidden">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">TeachEngine · Your teaching desk</p>
                    </div>
                    <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Teacher sign in</p><h2 className="mt-3 text-3xl font-black tracking-tight text-white">Welcome back</h2><p className="mt-3 text-slate-400">Pick up where your planning left off.</p></div>

                {error && (
                    <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-slate-200">Email address</label>
                        <input 
                            id="login-email"
                            type="email" required
                            autoComplete="email"
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="you@school.com"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <div className="mb-2 flex items-center justify-between gap-4"><label htmlFor="login-password" className="block text-sm font-semibold text-slate-200">Password</label><span className="text-xs text-slate-500">Keep it private</span></div>
                        <input 
                            id="login-password"
                            type="password" required
                            autoComplete="current-password"
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="••••••••"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-indigo-600/10 transition duration-150 hover:bg-indigo-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900">
                        Open my workspace
                    </button>
                </form>

                <p className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
                    New to TeachEngine?{" "}
                    <Link to="/register" className="font-semibold text-indigo-400 no-underline hover:text-indigo-300">Create your teacher account</Link>
                </p>
                </section>
            </div>
            </main>
        </div>
    );
}
