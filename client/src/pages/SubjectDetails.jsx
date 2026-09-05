import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import { Pencil, Trash2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import HierarchyBreadcrumb from "../components/ui/HierarchyBreadcrumb";



export default function SubjectDetails(){
    const {subjectId }= useParams();
    const [schemes, setSchemes] = useState([]);
    const [term, setTerm ] = useState("");
    const [ academicYear, setAcademicYear ] = useState("");
    const [ loading, setLoading] = useState(true);
    const [ error, setError] = useState();
    const [notice, setNotice] = useState("");
    const [editingScheme, setEditingScheme] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [actionBusy, setActionBusy] = useState(false);
    const [subjectContext, setSubjectContext] = useState({ subjectName: "", className: "", classId: "" });

    const fetchSubjectScheme = async()=>{
        try{
            const response = await API.get(`/schemes/subject/${subjectId}`);

            setSchemes(response.data.data);
            setLoading(false);
        }catch(err){
            setError(err.response?.data?.error?.message || "Fetching schemes failed");
        }
    }

    useEffect(()=>{
        fetchSubjectScheme();
        const fetchContext = async () => {
            try {
                const [subjectResponse, classesResponse] = await Promise.all([API.get(`/subjects/${subjectId}`), API.get('/classes')]);
                const subject = subjectResponse.data.data;
                const parentClass = classesResponse.data.data.find((item) => String(item.id) === String(subject.class_id));
                setSubjectContext({ subjectName: subject.subject_name, className: parentClass?.class_name || "Class", classId: subject.class_id });
            } catch {
                setError("Unable to load the teaching context.");
            }
        };
        fetchContext();
    }, []);

    const handleCreateScheme = async(e)=>{
        e.preventDefault();
        try{
            await API.post('/schemes', {term, academicYear, subjectId});
            setTerm("")
            setAcademicYear("");
            fetchSubjectScheme();
            setNotice("Scheme created successfully.");
        }catch{

        }
    };

    const handleUpdateScheme = async (event) => {
        event.preventDefault();
        setActionBusy(true);
        try {
            const response = await API.put(`/schemes/${editingScheme.id}`, { term: editingScheme.term, academicYear: editingScheme.academic_year });
            const updated = response.data.data?.[0] || response.data.data;
            setSchemes((current) => current.map((item) => item.id === editingScheme.id ? { ...item, ...updated } : item));
            setEditingScheme(null);
            setNotice("Scheme updated successfully.");
        } catch {
            setError("Unable to update the scheme. Please try again.");
        } finally {
            setActionBusy(false);
        }
    };

    const handleDeleteScheme = async () => {
        setActionBusy(true);
        try {
            await API.delete(`/schemes/${deleteTarget.id}`);
            setSchemes((current) => current.filter((item) => item.id !== deleteTarget.id));
            setDeleteTarget(null);
            setNotice("Scheme deleted successfully.");
        } catch (err) {
            setDeleteTarget(null);
            setError(err.response?.data?.error?.message || "Unable to delete the scheme. Remove its topics first.");
        } finally {
            setActionBusy(false);
        }
    };


    return (
        <div className="overflow-x-hidden p-4 sm:p-6 lg:p-10">
            <main className="mx-auto max-w-5xl">
            <HierarchyBreadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: subjectContext.className, href: subjectContext.classId ? `/classes/${subjectContext.classId}` : undefined }, { label: subjectContext.subjectName || "Subject" }]} />
            <PageHeader eyebrow="Subject workspace" title="Schemes of work" description="Organise the rhythm of your teaching across each term." />
            {notice && <p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p>}
            {error ? (
                <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">Something went wrong. {error}</p>
            ): loading ? (
                <p className="mt-8 text-slate-500">Loading schemes...</p>
            ): schemes.length === 0 ? <p className="mt-8 border-2 border-dashed border-slate-200 p-8 text-center text-slate-500">No scheme created yet.</p>:
                <div className="mt-8 grid gap-4 sm:grid-cols-2">{schemes.map(sch => <Card key={sch.id} interactive className="p-6"><Link className="block no-underline" to={`/schemes/${sch.id}`}><p className="eyebrow">Scheme of work</p><p className="mt-3 text-lg font-semibold text-slate-900">{sch.term}</p><p className="mt-2 text-sm text-slate-500">{sch.academic_year}</p><p className="mt-5 text-sm font-semibold text-indigo-600">Open scheme →</p></Link><div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4"><Button type="button" variant="secondary" onClick={() => setEditingScheme(sch)}><Pencil size={16} aria-hidden="true" />Edit</Button><Button type="button" variant="danger" onClick={() => setDeleteTarget(sch)}><Trash2 size={16} aria-hidden="true" />Delete</Button></div></Card>)}</div>
            }
                <Card as="form" onSubmit={handleCreateScheme} className="mt-12 max-w-xl space-y-4 p-6">
                    <h2 className="section-title">Add a scheme</h2>
                    <div className="space-y-4"><Field id="term" label="Term" onChange={(e) => setTerm(e.target.value)} value={term} placeholder="e.g. First term" type="text" required /><Field id="academicYear" label="Academic year" onChange={(e) => setAcademicYear(e.target.value)} value={academicYear} placeholder="e.g. 2026 / 2027" type="text" required /></div>
                    <Button type="submit" className="w-full sm:w-auto">Create scheme</Button>
                </Card>
            </main>
            {editingScheme && createPortal(<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.65)' }} className="flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setEditingScheme(null)}><form onSubmit={handleUpdateScheme} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"><h2 className="section-title">Edit scheme</h2><label htmlFor="edit-term" className="mt-5 block text-sm font-semibold text-slate-700">Term</label><input id="edit-term" className="field mt-2 rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" value={editingScheme.term} onChange={(event) => setEditingScheme({ ...editingScheme, term: event.target.value })} required /><label htmlFor="edit-year" className="mt-4 block text-sm font-semibold text-slate-700">Academic year</label><input id="edit-year" className="field mt-2 rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" value={editingScheme.academic_year} onChange={(event) => setEditingScheme({ ...editingScheme, academic_year: event.target.value })} required /><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setEditingScheme(null)} className="min-h-11 cursor-pointer rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" disabled={actionBusy} className="primary-button cursor-pointer disabled:cursor-not-allowed">{actionBusy ? "Saving..." : "Save changes"}</button></div></form></div>, document.body)}
            {deleteTarget && <ConfirmDialog title="Delete scheme?" message={`Are you sure you want to delete "${deleteTarget.term}"? Related topics may prevent deletion.`} busy={actionBusy} onCancel={() => setDeleteTarget(null)} onConfirm={handleDeleteScheme} />}
        </div>
    )
}