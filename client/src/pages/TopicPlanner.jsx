import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import ConfirmDialog from "../components/ConfirmDialog";
import { Pencil, Trash2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import HierarchyBreadcrumb from "../components/ui/HierarchyBreadcrumb";



export default function TopicPlanner(){
    const { schemeId} = useParams();
    const [topics, setTopics] = useState([]);
    const [title, setTitle] = useState("");
    const [objectives, setObjectives] = useState("");
    const [weekNo, setWeekNo] = useState("")
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [notice, setNotice] = useState("");
    const [editingTopic, setEditingTopic] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [actionBusy, setActionBusy] = useState(false);
    const [context, setContext] = useState({ className: "", classId: "", subjectName: "", subjectId: "", schemeName: "" });

    const fetchSchemeTopics = async()=>{
        try{
            const topicResponse = await API.get(`/topics/scheme/${schemeId}`);
            setTopics([...topicResponse.data.data].sort((first, second) => Number(first.week) - Number(second.week)));
            setLoading(false)
        }catch(err){
            setError(err.response?.data?.error?.message || "Failed to fetch topics");
            setLoading(false);
        }

        
    }

    useEffect(()=>{
        fetchSchemeTopics();
        const fetchContext = async () => {
            try {
                const schemeResponse = await API.get(`/schemes/${schemeId}`);
                const scheme = schemeResponse.data.data;
                const subjectResponse = await API.get(`/subjects/${scheme.subject_id}`);
                const subject = subjectResponse.data.data;
                const classesResponse = await API.get('/classes');
                const parentClass = classesResponse.data.data.find((item) => String(item.id) === String(subject.class_id));
                setContext({ className: parentClass?.class_name || "Class", classId: subject.class_id, subjectName: subject.subject_name, subjectId: subject.id, schemeName: `${scheme.term} ${scheme.academic_year}` });
            } catch {
                setError("Unable to load the teaching context.");
            }
        };
        fetchContext();

    }, []);

    const handleTopicSubmit = async(e)=>{
        e.preventDefault();
        try{
            await API.post('/topics', {title, objectives, week: weekNo, schemeId});
            setTitle("");
            setObjectives("");
            setWeekNo("");
            fetchSchemeTopics();
            setNotice("Topic created successfully.");
        }catch{
            setError("Unable to create the topic. Please try again.");
        }       
    }

    const handleUpdateTopic = async (event) => {
        event.preventDefault();
        setActionBusy(true);
        try {
            const response = await API.put(`/topics/${editingTopic.id}`, { title: editingTopic.title, objectives: editingTopic.objectives, week: editingTopic.week });
            const updated = response.data.data?.[0] || response.data.data;
            setTopics((current) => [...current.map((item) => item.id === editingTopic.id ? { ...item, ...updated } : item)].sort((first, second) => Number(first.week) - Number(second.week)));
            setEditingTopic(null);
            setNotice("Topic updated successfully.");
        } catch {
            setError("Unable to update the topic. Please try again.");
        } finally {
            setActionBusy(false);
        }
    };

    const handleDeleteTopic = async () => {
        setActionBusy(true);
        try {
            await API.delete(`/topics/${deleteTarget.id}`);
            setTopics((current) => current.filter((item) => item.id !== deleteTarget.id));
            setDeleteTarget(null);
            setNotice("Topic deleted successfully.");
        } catch (err) {
            setDeleteTarget(null);
            setError(err.response?.data?.error?.message || "Unable to delete the topic. Remove its lesson first.");
        } finally {
            setActionBusy(false);
        }
    };

    return (
        <div className="overflow-x-hidden p-4 sm:p-6 lg:p-10">
            <main className="mx-auto max-w-6xl">
                <HierarchyBreadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: context.className, href: context.classId ? `/classes/${context.classId}` : undefined }, { label: context.subjectName, href: context.subjectId ? `/subjects/${context.subjectId}` : undefined }, { label: context.schemeName || "Scheme" }]} />
                <PageHeader eyebrow="Scheme planner" title="Weekly topics" description="Turn your scheme into a clear, teachable sequence." />
                {notice && <p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p>}

                {error ? <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">Something went wrong. {error}</p> : loading ? <p className="mt-8 text-slate-500">Loading topics...</p> : topics.length === 0 ? <p className="mt-8 border-2 border-dashed border-slate-200 p-8 text-center text-slate-500">Your scheme is ready for its first topic.</p> : <div className="mt-8 grid gap-4 md:grid-cols-2">{topics.map(tp => <div key={tp.id} className="workspace-card p-6"><div className="flex items-start justify-between gap-4"><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Week {tp.week}</span><div className="flex gap-2"><button type="button" onClick={(event) => { event.stopPropagation(); setEditingTopic(tp); }} aria-label={`Edit ${tp.title}`} className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-50 sm:min-h-10 sm:min-w-10"><Pencil size={16} aria-hidden="true" /></button><button type="button" onClick={(event) => { event.stopPropagation(); setDeleteTarget(tp); }} aria-label={`Delete ${tp.title}`} className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 sm:min-h-10 sm:min-w-10"><Trash2 size={16} aria-hidden="true" /></button></div></div><h2 className="mt-5 text-lg font-semibold text-slate-900">{tp.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{tp.objectives}</p><div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4"><Link to={`/topics/${tp.id}/lesson`} className="primary-button min-h-11 px-4 py-2 text-sm no-underline sm:min-h-10">Open lesson</Link></div></div>)}</div>}

                <Card as="form" onSubmit={handleTopicSubmit} className="mt-12 max-w-3xl space-y-4 p-6">
                    <div><p className="eyebrow">Quick action</p><h2 className="mt-2 text-xl font-semibold text-slate-900">Add a weekly topic</h2></div>
                    <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="weekNo" className="mb-2 block text-sm font-semibold text-slate-700">Week number</label>
                    <input
                        id="weekNo"
                        type="number"
                        min="1"
                        required
                        value={weekNo}
                        onChange={(e) => setWeekNo(e.target.value)}
                        placeholder="e.g. 1"
                        className="field"
                    />
                </div>

                <div>
                    <label htmlFor="topicTitle" className="mb-2 block text-sm font-semibold text-slate-700">Topic</label>
                    <input
                        id="topicTitle"
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Cell structure"
                        className="field"
                    />
                </div>

                <div>
                    <label htmlFor="objectives" className="mb-2 block text-sm font-semibold text-slate-700">Objective</label>
                    <textarea
                        id="objectives"
                        required
                        value={objectives}
                        onChange={(e) => setObjectives(e.target.value)}
                        placeholder="What should students learn?"
                        className="field min-h-32"
                    />
                </div>

                    <Button type="submit" className="w-full sm:col-span-2 sm:w-auto">Add topic</Button></div>
                </Card>
            {editingTopic && createPortal(<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.65)' }} className="flex items-center justify-center overflow-y-auto p-4 backdrop-blur-sm" onClick={() => setEditingTopic(null)}><form onSubmit={handleUpdateTopic} onClick={(event) => event.stopPropagation()} className="my-8 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"><h2 className="section-title">Edit weekly topic</h2><label htmlFor="edit-week" className="mt-5 block text-sm font-semibold text-slate-700">Week number</label><input id="edit-week" type="number" min="1" className="field mt-2 rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" value={editingTopic.week} onChange={(event) => setEditingTopic({ ...editingTopic, week: event.target.value })} required /><label htmlFor="edit-topic-title" className="mt-4 block text-sm font-semibold text-slate-700">Topic</label><input id="edit-topic-title" className="field mt-2 rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" value={editingTopic.title} onChange={(event) => setEditingTopic({ ...editingTopic, title: event.target.value })} required /><label htmlFor="edit-objectives" className="mt-4 block text-sm font-semibold text-slate-700">Objective</label><textarea id="edit-objectives" className="field mt-2 min-h-28 rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" value={editingTopic.objectives} onChange={(event) => setEditingTopic({ ...editingTopic, objectives: event.target.value })} required /><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setEditingTopic(null)} className="min-h-11 cursor-pointer rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" disabled={actionBusy} className="primary-button cursor-pointer disabled:cursor-not-allowed">{actionBusy ? "Saving..." : "Save changes"}</button></div></form></div>, document.body)}
            {deleteTarget && <ConfirmDialog title="Delete topic?" message={`Are you sure you want to delete "Week ${deleteTarget.week} — ${deleteTarget.title}"? Its lesson note may prevent deletion.`} busy={actionBusy} onCancel={() => setDeleteTarget(null)} onConfirm={handleDeleteTopic} />}
            </main>
        </div>
    )
}