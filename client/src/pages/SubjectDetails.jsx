import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import { useState, useEffect } from "react";



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
        <div className="overflow-x-hidden p-4 sm:p-6 lg:p-10">
            <main className="mx-auto max-w-5xl">
            <p className="eyebrow">Subject workspace</p>
            <h1 className="page-title mt-3">Schemes of work</h1>
            <p className="mt-3 text-slate-500">Organise the rhythm of your teaching across each term.</p>
            {error ? (
                <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">Something went wrong. {error}</p>
            ): loading ? (
                <p className="mt-8 text-slate-500">Loading schemes...</p>
            ): schemes.length === 0 ? <p className="mt-8 border-2 border-dashed border-slate-200 p-8 text-center text-slate-500">No scheme created yet.</p>:
                <div className="mt-8 grid gap-4 sm:grid-cols-2">{schemes.map(sch => <Link key={sch.id} className="workspace-card workspace-card-interactive block p-6 no-underline" to={`/schemes/${sch.id}`}><p className="eyebrow">Scheme of work</p><p className="mt-3 text-lg font-semibold text-slate-900">{sch.term}</p><p className="mt-2 text-sm text-slate-500">{sch.academic_year}</p><p className="mt-5 text-sm font-semibold text-indigo-600">Open scheme →</p></Link>)}</div>
            }
                <form onSubmit={handleCreateScheme} className="workspace-card mt-12 max-w-xl space-y-4 p-6">
                    <h2 className="section-title">Add a scheme</h2>
                    <div className="space-y-4"><div><label htmlFor="term" className="mb-2 block text-sm font-semibold text-slate-700">Term</label><input id="term" className="field" onChange={(e) => setTerm(e.target.value)} value={term} placeholder="e.g. First term" type="text" required /></div><div><label htmlFor="academicYear" className="mb-2 block text-sm font-semibold text-slate-700">Academic year</label><input id="academicYear" className="field" onChange={(e) => setAcademicYear(e.target.value)} value={academicYear} placeholder="e.g. 2026 / 2027" type="text" required /></div></div>
                    <button type="submit" className="primary-button w-full sm:w-auto">Create scheme</button>
            </form>
            </main>
        </div>
    )
}