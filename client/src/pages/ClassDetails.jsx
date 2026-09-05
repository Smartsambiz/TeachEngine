import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function ClassDetails(){
    const {classId } = useParams();
    const [subjects, setSubjects] = useState([]);
    const [subjectName, setSubjectName ] = useState("");
    const [ loading, setLoading ] = useState(true);
    const [error, setError] = useState();
    const [ className , setClassName] =useState("");
    

    const fetchClassSubjects = async()=>{
        try{
            const response = await API.get(`\/subjects/class/${classId}`);
            
            setSubjects(response.data.data);
            setLoading(false);

        }catch(err){
            setError(err.response.data?.error?.message || "failed to fetch subjects");
        }
    };

    const fetchClassName = async()=>{
        try{
            const response = await API.get('/classes');
            const currentClass = response.data.data.find((classItem)=>{
                return String(classItem.id) === String(classId);
            });
            setClassName(currentClass?.class_name);
            setLoading(false);
        }catch(err){
            setError(err.response?.data?.error?.message || "Failed to fetch classes");
        }
        
    }

    useEffect(()=>{
        fetchClassSubjects();
        fetchClassName()

    }, [classId]);

    const handleCreateSubject =  async(e)=>{
        e.preventDefault();
        try{
            await API.post('/subjects', {subjectName: subjectName, classId});
            setSubjectName("");
            fetchClassSubjects();
        }catch{

        }
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-900 p-4 font-sans text-slate-100 sm:p-6 md:p-12">
            <Navbar />
            <main className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Class workspace</p>
            <h1 className="mt-3 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-4xl">{className || "Your class"}</h1>
            <p className="mt-3 text-slate-400">Choose a subject to review its schemes and lesson sequence.</p>
            {loading ? <p className="mt-8 text-slate-400">Loading your subjects...</p>: subjects.length === 0 ? <p className="mt-8 rounded-xl border-2 border-dashed border-slate-800 p-8 text-center text-slate-500">No subjects available yet. Add the first one below.</p> : <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {subjects.map(sub=>{
                        return (
                            <Link key={sub.id} className="block rounded-xl border border-slate-700/60 bg-slate-800/50 p-6 text-xl font-bold text-slate-100 no-underline shadow-xl backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-indigo-500/80 hover:shadow-indigo-500/5" to={`\/subjects/${sub.id}`}>{sub.subject_name}</Link>
                        )
                    })}
                </div>}
            
            <form onSubmit={handleCreateSubject} className="mt-12 max-w-xl space-y-4 rounded-xl border border-slate-800 bg-slate-800/30 p-6">
                    <h2 className="text-2xl font-bold text-slate-100">Add a subject</h2>
                    <div>
                        <label htmlFor="subjectName" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">Subject name</label><input id="subjectName" className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none" onChange={(e)=>{setSubjectName(e.target.value)}} value={subjectName} placeholder="e.g. Biology" required/>
                    </div>
                    <button type="submit" className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-indigo-600/10 transition duration-150 hover:bg-indigo-500 active:scale-95 sm:w-auto">Create subject</button>
            </form>
            </main>
        </div>
    )
}
