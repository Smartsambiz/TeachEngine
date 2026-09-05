import { useState, useEffect} from "react";
import { useAuth } from "../context/authContext";
import API from "../services/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard(){
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newClassName, setNewClassName ] = useState("");
    const [newAcademicYear, setNewAcademicYear] = useState("")
    const { user } = useAuth();
    const [ error, setError ]= useState("");

    const fetchTeacherClasses = async()=>{
        try{
            const response = await API.get('/classes');
            setClasses(response.data.data);
            setLoading(false);
        }catch(err){
            setError(err.response?.data?.error?.message || "Failed to fetch classes");
            setLoading(false);
        }
        
    }

    useEffect(()=>{
        fetchTeacherClasses();
    }, []);

    const handleCreateClass = async(e)=>{
        e.preventDefault();
        try{
            await API.post('/classes', {className: newClassName, academicYear: newAcademicYear});
            fetchTeacherClasses();
            setNewClassName("")
        }catch(err){
            setError(err.response?.data?.error?.message || "Failed to create class");
        }
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-950 p-4 font-sans text-slate-100 sm:p-6 md:p-12">
            <Navbar />

            <main className="mx-auto max-w-6xl">
                <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Teacher dashboard</p>
                        <h1 className="mt-3 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-4xl">Welcome back, {user?.name || "Teacher"}.</h1>
                        <p className="mt-4 max-w-xl text-base leading-7 text-slate-400">Keep your classes, schemes, and lesson thinking in one considered place.</p>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-[250px] sm:gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/50 px-3 py-2 shadow-xl sm:gap-3 sm:px-4 sm:py-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-300">{classes.length}</span><span className="text-xs font-semibold text-slate-300 sm:text-sm">Classes</span></div>
                        <div className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/50 px-3 py-2 shadow-xl sm:gap-3 sm:px-4 sm:py-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-300">26</span><span className="text-xs font-semibold text-slate-300 sm:text-sm">Term</span></div>
                    </div>
                </div>

                {error && <p role="alert" className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}

                <section className="mt-12">
                    <div className="flex items-center justify-between gap-4">
                        <div><h2 className="text-2xl font-bold text-slate-100">Your classes</h2><p className="mt-1 text-sm font-semibold uppercase tracking-wider text-slate-400">Open a class to continue planning.</p></div>
                        <span className="hidden text-sm text-slate-400 sm:block">{classes.length} active</span>
                    </div>
                    {loading ? <p className="mt-6 text-slate-400">Loading your classes...</p> : classes.length === 0 ? <p className="mt-6 rounded-xl border-2 border-dashed border-slate-800 p-8 text-center text-slate-500">Create your first class below to begin.</p> : <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {classes.map(cls => <Link key={cls.id} className="group block no-underline rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl transition duration-300 hover:-translate-y-0.5 hover:border-indigo-500/80 hover:shadow-indigo-500/5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950" to={`/classes/${cls.id}`}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-400">Class</p><h3 className="mt-3 text-2xl font-bold text-slate-100">{cls.class_name}</h3><p className="mt-2 text-sm text-slate-400">{cls.academic_year || "Academic year not set"}</p></div><span aria-hidden="true" className="text-xl text-indigo-400 transition group-hover:translate-x-1">→</span></div><div className="mt-6 border-t border-slate-800 pt-4 text-sm font-semibold text-slate-400 group-hover:text-indigo-300">Open class workspace</div></Link>)}
                    </div>}
                </section>

                <section className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
                        <div><p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Quick action</p><h2 className="mt-3 text-3xl font-bold text-slate-100">Start a new class plan.</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-400">Give the workspace a name and academic year. You can build subjects and schemes inside it next.</p></div>
                        <form onSubmit={handleCreateClass} className="max-w-xl space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6"><div><label htmlFor="className" className="mb-2 block text-sm font-semibold text-slate-300">Class name</label><input id="className" className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none" onChange={(e) => setNewClassName(e.target.value)} value={newClassName} required placeholder="e.g. Year 8 Science" /></div><div><label htmlFor="academicYear" className="mb-2 block text-sm font-semibold text-slate-300">Academic year</label><input id="academicYear" className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none" onChange={(e) => setNewAcademicYear(e.target.value)} value={newAcademicYear} required placeholder="e.g. 2026 / 2027" /></div><button type="submit" className="w-full sm:w-auto rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-indigo-600/10 transition duration-150 hover:bg-indigo-500 active:scale-95">Create class</button></form>
                    </div>
                </section>
            </main>
        </div>
    )
}