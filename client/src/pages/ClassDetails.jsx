import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import ConfirmDialog from "../components/ConfirmDialog";
import { Pencil, Trash2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import HierarchyBreadcrumb from "../components/ui/HierarchyBreadcrumb";

export default function ClassDetails(){
    const {classId } = useParams();
    const [subjects, setSubjects] = useState([]);
    const [subjectName, setSubjectName ] = useState("");
    const [ loading, setLoading ] = useState(true);
    const [error, setError] = useState();
    const [ className , setClassName] =useState("");
    const [editingSubject, setEditingSubject] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [notice, setNotice] = useState("");
    const [actionBusy, setActionBusy] = useState(false);
    

    const fetchClassSubjects = async()=>{
        try{
            const response = await API.get(`\/subjects/class/${classId}`);
            
            setSubjects(response.data.data);
            setLoading(false);

        }catch(err){
            setError(err.response?.data?.error?.message || "Failed to fetch subjects");
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
            setNotice("Subject created successfully.");
        }catch{

        }
    }

    const handleUpdateSubject = async (event) => {
        event.preventDefault();
        setActionBusy(true);
        try {
            const response = await API.put(`/subjects/${editingSubject.id}`, { subjectName: editingSubject.subject_name });
            const updated = response.data.data?.[0] || response.data.data;
            setSubjects((current) => current.map((item) => item.id === editingSubject.id ? { ...item, ...updated } : item));
            setEditingSubject(null);
            setNotice("Subject updated successfully.");
        } catch {
            setError("Unable to update the subject. Please try again.");
        } finally {
            setActionBusy(false);
        }
    };

    const handleDeleteSubject = async () => {
        setActionBusy(true);
        try {
            await API.delete(`/subjects/${deleteTarget.id}`);
            setSubjects((current) => current.filter((item) => item.id !== deleteTarget.id));
            setDeleteTarget(null);
            setNotice("Subject deleted successfully.");
        } catch (err) {
            setDeleteTarget(null);
            setError(err.response?.data?.error?.message || "Unable to delete the subject. Remove its schemes first.");
        } finally {
            setActionBusy(false);
        }
    };

    return (
        <div className="overflow-x-hidden p-4 sm:p-6 lg:p-10">
            <main className="mx-auto max-w-6xl">
            <HierarchyBreadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: className || "Class" }]} />
            <PageHeader eyebrow="Class workspace" title={className || "Your class"} description="Choose a subject to review its schemes and lesson sequence." />
            {error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
            {notice && <p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p>}
            {loading ? <p className="mt-8 text-slate-500">Loading your subjects...</p>: subjects.length === 0 ? <p className="mt-8 border-2 border-dashed border-slate-200 p-8 text-center text-slate-500">No subjects available yet. Add the first one below.</p> : <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {subjects.map(sub=>{
                        return (
                            <Card key={sub.id} interactive className="p-6"><Link className="block text-lg font-semibold text-slate-900 no-underline" to={`/subjects/${sub.id}`}>{sub.subject_name}<span className="mt-4 block text-sm font-medium text-indigo-600">Open subject →</span></Link><div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4"><Button type="button" variant="secondary" onClick={() => setEditingSubject(sub)}><Pencil size={16} aria-hidden="true" />Edit</Button><Button type="button" variant="danger" onClick={() => setDeleteTarget(sub)}><Trash2 size={16} aria-hidden="true" />Delete</Button></div></Card>
                        )
                    })}
                </div>}
            
                <Card as="form" onSubmit={handleCreateSubject} className="mt-12 max-w-xl space-y-4 p-6">
                    <h2 className="section-title">Add a subject</h2>
                    <div>
                        <Field id="subjectName" label="Subject name" onChange={(e)=>{setSubjectName(e.target.value)}} value={subjectName} placeholder="e.g. Biology" required/>
                    </div>
                    <Button type="submit" className="w-full sm:w-auto">Create subject</Button>
                </Card>
            </main>
            {editingSubject && createPortal(<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.65)' }} className="flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setEditingSubject(null)}><form onSubmit={handleUpdateSubject} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"><h2 className="section-title">Edit subject</h2><label htmlFor="edit-subject-name" className="mt-5 block text-sm font-semibold text-slate-700">Subject name</label><input id="edit-subject-name" className="field mt-2 rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" value={editingSubject.subject_name} onChange={(event) => setEditingSubject({ ...editingSubject, subject_name: event.target.value })} required /><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setEditingSubject(null)} className="min-h-11 cursor-pointer rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" disabled={actionBusy} className="primary-button cursor-pointer disabled:cursor-not-allowed">{actionBusy ? "Saving..." : "Save changes"}</button></div></form></div>, document.body)}
            {deleteTarget && <ConfirmDialog title="Delete subject?" message={`Are you sure you want to delete "${deleteTarget.subject_name}"? Related schemes may prevent deletion.`} busy={actionBusy} onCancel={() => setDeleteTarget(null)} onConfirm={handleDeleteSubject} />}
        </div>
    )
}
