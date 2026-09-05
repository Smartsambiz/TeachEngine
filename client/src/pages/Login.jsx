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
        <div className="min-h-screen overflow-x-hidden bg-[#f7f8fc] p-4 font-sans text-slate-900 sm:p-6 md:p-10">
            <Navbar />
            <main className="flex min-h-[calc(100vh-6rem)] items-center justify-center py-8 sm:py-12">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
                <section className="hidden bg-indigo-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">Your teaching desk</p>
                        <h1 className="mt-8 max-w-lg text-4xl font-black leading-tight tracking-tight xl:text-5xl">Plan less admin. Teach with more intention.</h1>
                        <p className="mt-6 max-w-md text-base leading-7 text-indigo-100">TeachEngine keeps your classes, weekly schemes, objectives, and lesson notes together so your best thinking is easy to find.</p>
                        <div className="mt-10 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-indigo-50"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">1</span>Organise every class in one workspace</div>
                            <div className="flex items-center gap-3 text-sm text-indigo-50"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">2</span>Turn objectives into weekly teaching plans</div>
                            <div className="flex items-center gap-3 text-sm text-indigo-50"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">3</span>Keep lesson notes ready for the classroom</div>
                        </div>
                    </div>
                    <p className="text-sm text-indigo-200">A quieter way to prepare meaningful lessons.</p>
                </section>

                <section className="bg-white p-6 sm:p-10 lg:p-12">
                    <div className="mb-8 lg:hidden">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">TeachEngine · Your teaching desk</p>
                    </div>
                    <div className="mb-8"><p className="eyebrow">Teacher sign in</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Welcome back</h2><p className="mt-3 text-slate-500">Pick up where your planning left off.</p></div>

                {error && (
                    <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                        <input 
                            id="login-email"
                            type="email" required
                            autoComplete="email"
                            className="field"
                            placeholder="you@school.com"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <div className="mb-2 flex items-center justify-between gap-4"><label htmlFor="login-password" className="block text-sm font-semibold text-slate-700">Password</label><span className="text-xs text-slate-400">Keep it private</span></div>
                        <input 
                            id="login-password"
                            type="password" required
                            autoComplete="current-password"
                            className="field"
                            placeholder="••••••••"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="primary-button w-full">
                        Open my workspace
                    </button>
                </form>

                <p className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
                    New to TeachEngine?{" "}
                    <Link to="/register" className="link-accent no-underline">Create your teacher account</Link>
                </p>
                </section>
            </div>
            </main>
        </div>
    );
}
