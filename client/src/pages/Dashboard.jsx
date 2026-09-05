import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import API from "../services/api";
import { Link } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import { createPortal } from "react-dom";
import { ArrowUpRight, BookOpen, CalendarDays, Pencil, Plus, Trash2, UsersRound } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Field from "../components/ui/Field";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

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
        <div className="px-4 py-6 sm:py-8 lg:py-10">
            <main className="mx-auto max-w-6xl">
                <PageHeader eyebrow="Teacher dashboard" title={`Good morning, ${user?.name || "Teacher"}.`} description="Here's what you're working on. Keep your classes, schemes, and lesson thinking in one considered place." />
                <div className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:max-w-md">
                        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                                <UsersRound size={20} aria-hidden="true" />
                            </span>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{classes.length}</p>
                                <p className="text-sm text-slate-600">Classes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                                <CalendarDays size={20} aria-hidden="true" />
                            </span>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">2026</p>
                                <p className="text-sm text-slate-600">Current term</p>
                            </div>
                        </div>
                </div>

                {error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Something went wrong. {error}</p>}
                {notice && <p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p>}

                <section id="classes" className="mt-8">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Your classes</h2>
                            <p className="mt-2 text-sm text-slate-600">Open a class to continue planning.</p>
                        </div>
                        <span className="hidden text-sm text-slate-500 sm:block">{classes.length} active</span>
                    </div>
                    {loading ? <p className="mt-6 text-sm text-slate-600">Loading your classes...</p> : classes.length === 0 ? <div className="mt-6"><EmptyState title="Your teaching workspace is empty" description="Create your first class below to begin planning." /></div> : <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {classes.map(cls => (
                            <Card key={cls.id} interactive className="p-5 sm:p-6">
                                <Link className="group block rounded-lg no-underline focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2" to={`/classes/${cls.id}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex min-w-0 items-start gap-4">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                                                <BookOpen size={20} aria-hidden="true" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Class</p>
                                                <h3 className="mt-2 break-words text-lg font-semibold text-slate-900">{cls.class_name}</h3>
                                                <p className="mt-2 text-sm text-slate-600">{cls.academic_year || cls.academic_term || "Academic year not set"}</p>
                                            </div>
                                        </div>
                                        <ArrowUpRight size={20} aria-hidden="true" className="shrink-0 text-amber-800 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </div>
                                    <div className="mt-5 border-t border-slate-200 pt-4 text-sm font-semibold text-amber-700">Open class workspace</div>
                                </Link>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setEditingClass({ ...cls, academic_term: cls.academic_term || cls.academic_year || "" });
                                        }}
                                        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:min-h-10"
                                    >
                                        <Pencil size={16} aria-hidden="true" />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setDeleteTarget(cls);
                                        }}
                                        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:min-h-10"
                                    >
                                        <Trash2 size={16} aria-hidden="true" />
                                        Delete
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>}
                </section>

                <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-end">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick action</p>
                            <h2 className="mt-3 text-lg font-semibold text-slate-900">Start a new class plan</h2>
                            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">Give the workspace a name and academic year. You can build subjects and schemes inside it next.</p>
                        </div>
                        <form onSubmit={handleCreateClass} className="max-w-xl space-y-4">
                            <Field id="className" label="Class name" onChange={(e) => setNewClassName(e.target.value)} value={newClassName} required placeholder="e.g. Year 8 Science" />
                            <Field id="academicYear" label="Academic year" onChange={(e) => setNewAcademicYear(e.target.value)} value={newAcademicYear} required placeholder="e.g. 2026 / 2027" />
                            <Button type="submit" className="w-full sm:w-auto">
                                <Plus size={16} aria-hidden="true" />
                                Create class
                            </Button>
                        </form>
                    </div>
                </section>
            </main>

            {/* EDIT MODAL PORTAL */}
            {editingClass && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
                    onClick={() => setEditingClass(null)}
                >
                    <form
                        onSubmit={handleUpdateClass}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
                    >
                        <h2 className="text-lg font-semibold text-slate-900">Edit class</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="edit-class-name" className="block text-sm font-semibold text-slate-700">Class name</label>
                                <input
                                    id="edit-class-name"
                                    className="field mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-amber-700"
                                    value={editingClass.class_name}
                                    onChange={(event) => setEditingClass({ ...editingClass, class_name: event.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-class-year" className="block text-sm font-semibold text-slate-700">Academic year</label>
                                <input
                                    id="edit-class-year"
                                    className="field mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-amber-700"
                                    value={editingClass.academic_term}
                                    onChange={(event) => setEditingClass({ ...editingClass, academic_term: event.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button type="button" onClick={() => setEditingClass(null)} className="min-h-11 cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:min-h-10">
                                Cancel
                            </button>
                            <button type="submit" disabled={actionBusy} className="min-h-11 cursor-pointer rounded-lg bg-amber-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-10">
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
