import { useState, useEffect} from "react";
import { useAuth } from "../context/authContext";
import API from "../services/api";
import { Link } from "react-router-dom";

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
        <div className="overflow-x-hidden p-4 sm:p-6 lg:p-10">
            <main className="mx-auto max-w-6xl">
                <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
                    <div>
                        <p className="eyebrow">Teacher dashboard</p>
                        <h1 className="page-title mt-3">Good morning, {user?.name || "Teacher"}.</h1>
                        <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">Here&apos;s what you&apos;re working on. Keep your classes, schemes, and lesson thinking in one considered place.</p>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-[250px] sm:gap-3">
                        <div className="workspace-card flex items-center gap-3 px-4 py-3"><span className="text-2xl font-bold text-slate-900">{classes.length}</span><span className="text-sm font-medium text-slate-500">Classes</span></div>
                        <div className="workspace-card flex items-center gap-3 px-4 py-3"><span className="text-2xl font-bold text-slate-900">2026</span><span className="text-sm font-medium text-slate-500">Current term</span></div>
                    </div>
                </div>

                {error && <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Something went wrong. {error}</p>}

                <section className="mt-12">
                    <div className="flex items-center justify-between gap-4">
                        <div><h2 className="section-title">Your classes</h2><p className="mt-1 text-sm text-slate-500">Open a class to continue planning.</p></div>
                        <span className="hidden text-sm text-slate-400 sm:block">{classes.length} active</span>
                    </div>
                    {loading ? <p className="mt-6 text-slate-500">Loading your classes...</p> : classes.length === 0 ? <p className="mt-6 border-2 border-dashed border-slate-200 p-8 text-center text-slate-500">Your teaching workspace is empty. Create your first class below.</p> : <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {classes.map(cls => <Link key={cls.id} className="workspace-card workspace-card-interactive group block p-5 no-underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" to={`/classes/${cls.id}`}><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Class</p><h3 className="mt-2 text-lg font-semibold text-slate-900">{cls.class_name}</h3><p className="mt-2 text-sm text-slate-500">{cls.academic_year || "Academic year not set"}</p></div><span aria-hidden="true" className="text-xl text-indigo-600 transition group-hover:translate-x-1">→</span></div><div className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold text-indigo-600">Open class workspace</div></Link>)}
                    </div>}
                </section>

                <section className="workspace-card mt-12 p-6 sm:p-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
                        <div><p className="eyebrow">Quick action</p><h2 className="mt-3 text-2xl font-semibold text-slate-900">Start a new class plan</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-500">Give the workspace a name and academic year. You can build subjects and schemes inside it next.</p></div>
                        <form onSubmit={handleCreateClass} className="max-w-xl space-y-4"><div><label htmlFor="className" className="mb-2 block text-sm font-semibold text-slate-700">Class name</label><input id="className" className="field" onChange={(e) => setNewClassName(e.target.value)} value={newClassName} required placeholder="e.g. Year 8 Science" /></div><div><label htmlFor="academicYear" className="mb-2 block text-sm font-semibold text-slate-700">Academic year</label><input id="academicYear" className="field" onChange={(e) => setNewAcademicYear(e.target.value)} value={newAcademicYear} required placeholder="e.g. 2026 / 2027" /></div><button type="submit" className="primary-button w-full sm:w-auto">Create class</button></form>
                    </div>
                </section>
            </main>
        </div>
    )
}