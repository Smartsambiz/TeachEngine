import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";



export default function SubjectDetails(){
    const {subjectId }= useParams();
    const [schemes, setSchemes] = useState([]);
    const [term, setTerm ] = useState("");
    const [ academicYear, setAcademicYear ] = useState("");
    const [ loading, setLoading] = useState(true);
    const [ error, setError] = useState();

    const fetchSubjectScheme = async()=>{
        try{
            const response = await API.get(`\/schemes/subject/${subjectId}`);

            setSchemes(response.data.data);
            setLoading(false);
        }catch(err){
            setError(err.response?.data?.error?.message || "Fetching schemes failed");
        }
    }

    useEffect(()=>{
        fetchSubjectScheme();
    }, []);

    const handleCreateScheme = async(e)=>{
        e.preventDefault();
        try{
            await API.post('/schemes', {term, academicYear, subjectId});
            setTerm("")
            setAcademicYear("");
            fetchSubjectScheme()
        }catch{

        }
    };


    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-900 p-4 font-sans text-slate-100 sm:p-6 md:p-12">
            <Navbar />
            <main className="mx-auto max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Subject workspace</p>
            <h1 className="mt-3 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-4xl">Schemes of work</h1>
            <p className="mt-3 text-slate-400">Organise the rhythm of your teaching across each term.</p>
            {error ? (
                <p role="alert" className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{error}</p>
            ): loading ? (
                <p className="mt-8 text-slate-400">Loading schemes...</p>
            ): schemes.length === 0 ? <p className="mt-8 rounded-xl border-2 border-dashed border-slate-800 p-8 text-center text-slate-500">No scheme created yet.</p>:
                <div className="mt-8 grid gap-4 sm:grid-cols-2">{schemes.map(sch => <Link key={sch.id} className="block rounded-xl border border-slate-700/60 bg-slate-800/50 p-6 text-slate-100 no-underline shadow-xl backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-indigo-500/80 hover:shadow-indigo-500/5" to={`/schemes/${sch.id}`}><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Scheme of work</p><p className="mt-3 text-2xl font-bold text-slate-100">{sch.term}</p><p className="mt-2 text-sm text-slate-400">{sch.academic_year}</p></Link>)}</div>
            }
            <form onSubmit={handleCreateScheme} className="mt-12 max-w-xl space-y-4 rounded-xl border border-slate-800 bg-slate-800/30 p-6">
                    <h2 className="text-2xl font-bold text-slate-100">Add a scheme</h2>
                    <div className="space-y-4"><div><label htmlFor="term" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">Term</label><input id="term" className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none" onChange={(e) => setTerm(e.target.value)} value={term} placeholder="e.g. First term" type="text" required /></div><div><label htmlFor="academicYear" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">Academic year</label><input id="academicYear" className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none" onChange={(e) => setAcademicYear(e.target.value)} value={academicYear} placeholder="e.g. 2026 / 2027" type="text" required /></div></div>
                    <button type="submit" className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-indigo-600/10 transition duration-150 hover:bg-indigo-500 active:scale-95 sm:w-auto">Create scheme</button>
            </form>
            </main>
        </div>
    )
}