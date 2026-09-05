import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import API from "../services/api";
import { Link } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import { createPortal } from "react-dom";

export default function Dashboard() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newClassName, setNewClassName] = useState("");
    const [newAcademicYear, setNewAcademicYear] = useState("");
    const { user } = useAuth();
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [editingClass, setEditingClass] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [actionBusy, setActionBusy] = useState(false);

    const fetchTeacherClasses = async () => {
        try {
            const response = await API.get('/classes');
            setClasses(response.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to fetch classes");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeacherClasses();
    }, []);

    const handleCreateClass = async (e) => {
        e.preventDefault();
        try {
            await API.post('/classes', { className: newClassName, academicYear: newAcademicYear });
            fetchTeacherClasses();
            setNewClassName("");
            setNewAcademicYear("");
            setNotice("Class created successfully.");
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to create class");
        }
    };

    const handleUpdateClass = async (event) => {
        event.preventDefault();
        setActionBusy(true);
        setError("");
        try {
            const response = await API.put(`/classes/${editingClass.id}`, { className: editingClass.class_name, academicYear: editingClass.academic_term });
            const updated = response.data.data?.[0] || response.data.data;
            setClasses((current) => current.map((item) => item.id === editingClass.id ? { ...item, ...updated, class_name: updated?.class_name || editingClass.class_name, academic_term: updated?.academic_term || editingClass.academic_term } : item));
            setEditingClass(null);
            setNotice("Class updated successfully.");
        } catch {
            setError("Unable to update the class. Please try again.");
        } finally {
            setActionBusy(false);
        }
    };

    const handleDeleteClass = async () => {
        setActionBusy(true);
        try {
            await API.delete(`/classes/${deleteTarget.id}`);
            setClasses((current) => current.filter((item) => item.id !== deleteTarget.id));
            setDeleteTarget(null);
            setNotice("Class deleted successfully.");
        } catch (err) {
            setDeleteTarget(null);
            setError(err.response?.data?.error?.message || "Unable to delete the class. Remove related subjects first.");
        } finally {
            setActionBusy(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-10">
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
                {notice && <p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p>}

                <section className="mt-12">
                    <div className="flex items-center justify-between gap-4">
                        <div><h2 className="section-title">Your classes</h2><p className="mt-1 text-sm text-slate-500">Open a class to continue planning.</p></div>
                        <span className="hidden text-sm text-slate-400 sm:block">{classes.length} active</span>
                    </div>
                    {loading ? <p className="mt-6 text-slate-500">Loading your classes...</p> : classes.length === 0 ? <p className="mt-6 border-2 border-dashed border-slate-200 p-8 text-center text-slate-500">Your teaching workspace is empty. Create your first class below.</p> : <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {classes.map(cls => (
                            <div key={cls.id} className="workspace-card p-5">
                                <Link className="group block no-underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" to={`/classes/${cls.id}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="eyebrow">Class</p>
                                            <h3 className="mt-2 text-lg font-semibold text-slate-900">{cls.class_name}</h3>
                                            <p className="mt-2 text-sm text-slate-500">{cls.academic_year || cls.academic_term || "Academic year not set"}</p>
                                        </div>
                                        <span aria-hidden="true" className="text-xl text-indigo-600 transition group-hover:translate-x-1">→</span>
                                    </div>
                                    <div className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold text-indigo-600">Open class workspace</div>
                                </Link>
                                <div className="mt-4 flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={(event) => { 
                                            event.stopPropagation(); 
                                            setEditingClass({ ...cls, academic_term: cls.academic_term || cls.academic_year || "" }); 
                                        }} 
                                        className="min-h-11 text-sm font-semibold text-slate-500 hover:text-indigo-700 cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={(event) => { 
                                            event.stopPropagation(); 
                                            setDeleteTarget(cls); 
                                        }} 
                                        className="min-h-11 text-sm font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>}
                </section>

                <section className="workspace-card mt-12 p-6 sm:p-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
                        <div><p className="eyebrow">Quick action</p><h2 className="mt-3 text-2xl font-semibold text-slate-900">Start a new class plan</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-500">Give the workspace a name and academic year. You can build subjects and schemes inside it next.</p></div>
                        <form onSubmit={handleCreateClass} className="max-w-xl space-y-4"><div><label htmlFor="className" className="mb-2 block text-sm font-semibold text-slate-700">Class name</label><input id="className" className="field" onChange={(e) => setNewClassName(e.target.value)} value={newClassName} required placeholder="e.g. Year 8 Science" /></div><div><label htmlFor="academicYear" className="mb-2 block text-sm font-semibold text-slate-700">Academic year</label><input id="academicYear" className="field" onChange={(e) => setNewAcademicYear(e.target.value)} value={newAcademicYear} required placeholder="e.g. 2026 / 2027" /></div><button type="submit" className="primary-button w-full sm:w-auto">Create class</button></form>
                    </div>
                </section>
            </main>

            {/* EDIT MODAL PORTAL */}
            {editingClass && createPortal(
                <div 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.65)' }} 
                    className="flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setEditingClass(null)}
                >
                    <form 
                        onSubmit={handleUpdateClass} 
                        onClick={(e) => e.stopPropagation()} 
                        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-slate-900">Edit class</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="edit-class-name" className="block text-sm font-semibold text-slate-700">Class name</label>
                                <input 
                                    id="edit-class-name" 
                                    className="field mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" 
                                    value={editingClass.class_name} 
                                    onChange={(event) => setEditingClass({ ...editingClass, class_name: event.target.value })} 
                                    required 
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-class-year" className="block text-sm font-semibold text-slate-700">Academic year</label>
                                <input 
                                    id="edit-class-year" 
                                    className="field mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" 
                                    value={editingClass.academic_term} 
                                    onChange={(event) => setEditingClass({ ...editingClass, academic_term: event.target.value })} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button type="button" onClick={() => setEditingClass(null)} className="min-h-11 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={actionBusy} className="primary-button rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                                {actionBusy ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                </div>,
                document.body
            )}

            {/* DELETE MODAL PORTAL */}
            {deleteTarget && createPortal(
                <ConfirmDialog 
                    title="Delete class?" 
                    message={`Are you sure you want to delete "${deleteTarget.class_name}"? Related subjects may prevent deletion.`} 
                    busy={actionBusy} 
                    onCancel={() => setDeleteTarget(null)} 
                    onConfirm={handleDeleteClass} 
                />,
                document.body
            )}
        </div>
    );
}