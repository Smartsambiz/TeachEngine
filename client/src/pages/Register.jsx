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
        <div className="min-h-screen overflow-x-hidden bg-[#f7f8fc] p-4 font-sans text-slate-900 sm:p-6 md:p-10">
            <Navbar />
            <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
            <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">TeachEngine</span>
                        <h1 className="page-title mt-5">Create your workspace</h1>
                        <p className="mt-3 text-slate-500">Build a living curriculum your students can feel.</p>
                    </div>
                    <span className="hidden text-right text-xs font-semibold uppercase tracking-widest text-slate-400 sm:block">01 / 01</span>
                </div>

                {error && (
                    <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}> 
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
                        <input
                            type='text' required
                            className="field"
                            placeholder='prof xavier'
                            onChange={(e)=>{setFormData({...formData, name: e.target.value})}} 
                        ></input>
                    </div>
                     <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                        <input
                            type='email' required
                            className="field"
                            placeholder='xavier@gmail.com'
                            onChange={(e)=>{setFormData({...formData, email: e.target.value})}} 
                        ></input>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                        <input
                            type='password' required
                            className="field"
                            placeholder='********'
                            onChange={(e)=>{setFormData({...formData, password: e.target.value})}} 
                        ></input>
                    </div>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className="primary-button w-full"
                    >
                        {isSubmitting ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link to='/login' className="link-accent no-underline">Log in</Link>
                </p>
            </div>
            </main>
        </div>
    )
}

