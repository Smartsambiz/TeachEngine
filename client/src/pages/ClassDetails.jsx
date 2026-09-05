import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

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
        <div className="overflow-x-hidden p-4 sm:p-6 lg:p-10">
            <main className="mx-auto max-w-6xl">
            <p className="eyebrow">Class workspace</p>
            <h1 className="page-title mt-3">{className || "Your class"}</h1>
            <p className="mt-3 text-slate-500">Choose a subject to review its schemes and lesson sequence.</p>
            {loading ? <p className="mt-8 text-slate-500">Loading your subjects...</p>: subjects.length === 0 ? <p className="mt-8 border-2 border-dashed border-slate-200 p-8 text-center text-slate-500">No subjects available yet. Add the first one below.</p> : <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {subjects.map(sub=>{
                        return (
                            <Link key={sub.id} className="workspace-card workspace-card-interactive block p-6 text-lg font-semibold text-slate-900 no-underline" to={`\/subjects/${sub.id}`}>{sub.subject_name}<span className="mt-4 block text-sm font-medium text-indigo-600">Open subject →</span></Link>
                        )
                    })}
                </div>}
            
                <form onSubmit={handleCreateSubject} className="workspace-card mt-12 max-w-xl space-y-4 p-6">
                    <h2 className="section-title">Add a subject</h2>
                    <div>
                        <label htmlFor="subjectName" className="mb-2 block text-sm font-semibold text-slate-700">Subject name</label><input id="subjectName" className="field" onChange={(e)=>{setSubjectName(e.target.value)}} value={subjectName} placeholder="e.g. Biology" required/>
                    </div>
                    <button type="submit" className="primary-button w-full sm:w-auto">Create subject</button>
            </form>
            </main>
        </div>
    )
}
