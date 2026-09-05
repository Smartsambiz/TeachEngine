import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';


export default function RegisterUser(){
    const [formData, setFormData] = useState({name: "", email: "", password: ""});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try{
            await API.post("/auth/register", formData);
            navigate("/login")
        }catch(err){
            setError(err.response?.data?.error?.message || 'Registeration failed');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-900 p-4 font-sans text-slate-100 sm:p-6 md:p-12">
            <Navbar />
            <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
            <div className="w-full max-w-xl rounded-xl border border-slate-700/60 bg-slate-800/50 p-6 shadow-xl backdrop-blur sm:p-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <span className="inline-flex rounded-full border border-indigo-500/50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">TeachEngine</span>
                        <h1 className="mt-5 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-4xl font-black tracking-tight text-transparent">Create your workspace</h1>
                        <p className="mt-3 text-slate-400">Build a living curriculum your students can feel.</p>
                    </div>
                    <span className="hidden text-right text-xs font-semibold uppercase tracking-widest text-slate-500 sm:block">01 / 01</span>
                </div>

                {error && (
                    <div role="alert" className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}> 
                    <div>
                        <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">Full name</label>
                        <input
                            type='text' required
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none"
                            placeholder='prof xavier'
                            onChange={(e)=>{setFormData({...formData, name: e.target.value})}} 
                        ></input>
                    </div>
                     <div>
                        <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">Email address</label>
                        <input
                            type='email' required
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none"
                            placeholder='xavier@gmail.com'
                            onChange={(e)=>{setFormData({...formData, email: e.target.value})}} 
                        ></input>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">Password</label>
                        <input
                            type='password' required
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none"
                            placeholder='********'
                            onChange={(e)=>{setFormData({...formData, password: e.target.value})}} 
                        ></input>
                    </div>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-indigo-600/10 transition duration-150 hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <Link to='/login' className="font-semibold text-indigo-400 no-underline hover:text-indigo-300">Log in</Link>
                </p>
            </div>
            </main>
        </div>
    )
}

