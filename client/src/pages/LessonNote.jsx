import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import ConfirmDialog from "../components/ConfirmDialog";
import { createPortal } from "react-dom";

export default function LessonNote() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("draft");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [studentLevel, setStudentLevel] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editingLesson, setEditingLesson] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const parseLessonContent = (value) => {
        if (!value) {
            return null;
        }

        try {
            const parsed = JSON.parse(value);
            return parsed && typeof parsed === "object" ? parsed : null;
        } catch {
            return null;
        }
    };

    const getLessonContent = () => parseLessonContent(content);
    const linesToArray = (value) => value.split("\n").map((line) => line.trim()).filter(Boolean);
    const arrayToLines = (value = []) => value.join("\n");

    const fetchLessonNote = async () => {
        try {
            const response = await API.get(`/lesson/topic/${topicId}`);
            const lessonNote = response.data.data;

            setNote(lessonNote);
            setContent(lessonNote.content || "");
            setStatus(lessonNote.status || "draft");
        } catch (err) {
            if (err.response?.status !== 404) {
                setError(err.response?.data?.error?.message || "Failed to fetch lesson note");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLessonNote();
    }, [topicId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");
        setSaving(true);

        try {
            const response = note
                ? await API.put(`/lesson/${note.id}`, { content, status })
                : await API.post("/lesson", { content, status, topicId });

            const savedNote = response.data.data?.[0] || response.data.data;
            setNote(savedNote);
            setContent(savedNote.content || content);
            setStatus(savedNote.status || status);
            setMessage("Lesson note saved successfully.");
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to save lesson note");
        } finally {
            setSaving(false);
        }
    };

    const handleGenerate = async () => {
        setError("");
        setMessage("");
        setGenerating(true);

        try {
            const response = await API.post("/lesson/generate", { topicId, studentLevel });
            const generatedNote = response.data.data?.[0] || response.data.data;
            setNote(generatedNote);
            setContent(generatedNote.content || "");
            setStatus(generatedNote.status || "draft");
            setMessage("Lesson draft generated. Review it before saving changes.");
        } catch (err) {
            setError("We couldn't generate this lesson right now. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const startLessonEdit = () => {
        const editableLesson = structuredLesson || {
            lessonInfo: {},
            objectives: [],
            materials: [],
            previousKnowledge: "",
            introduction: { teacherActivity: content, studentActivity: "", expectedResponses: [] },
            lessonDevelopment: [],
            activities: [],
            evaluation: { oralQuestions: [], shortAnswerQuestions: [], multipleChoiceQuestions: [], applicationQuestions: [], answerKey: [] },
            summary: [],
            homework: []
        };
        setEditingLesson(JSON.parse(JSON.stringify(editableLesson)));
    };

    const handleStructuredSave = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");
        try {
            const serialized = JSON.stringify(editingLesson);
            const response = note
                ? await API.put(`/lesson/${note.id}`, { content: serialized, status })
                : await API.post("/lesson", { content: serialized, status, topicId });
            const savedNote = response.data.data?.[0] || response.data.data;
            setNote(savedNote);
            setContent(serialized);
            setEditingLesson(null);
            setMessage("Lesson saved successfully.");
        } catch {
            setError("Unable to save the lesson. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteLesson = async () => {
        setSaving(true);
        try {
            await API.delete(`/lesson/${note.id}`);
            setDeleteOpen(false);
            setNote(null);
            setContent("");
            setMessage("Lesson deleted successfully.");
        } catch {
            setError("Unable to delete the lesson. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const structuredLesson = getLessonContent();
    const renderList = (items = []) => items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>);

    return (
        <div className="overflow-x-hidden p-4 sm:p-6 lg:p-10">
            <main className="mx-auto max-w-5xl">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                    Back to topics
                </button>

                <div className="mt-8 border-b border-slate-200 pb-8"><p className="eyebrow">Lesson workspace</p><h1 className="page-title mt-3">Build a lesson students can use</h1><p className="mt-3 text-slate-500">Write your own note or let TeachEngine create a starting draft from the topic objectives.</p></div>

                {loading ? (
                    <p className="mt-8 text-slate-500">Loading lesson note...</p>
                ) : (
                    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
                    <section className="workspace-card h-fit p-5 sm:p-6">
                        <p className="eyebrow">AI assist</p>
                        <h2 className="mt-2 text-lg font-semibold text-slate-900">Create a first draft</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">Use the topic objectives as a starting point, then make the lesson yours.</p>
                        <label htmlFor="studentLevel" className="mb-2 mt-6 block text-sm font-semibold text-slate-700">Student level</label>
                        <input id="studentLevel" value={studentLevel} onChange={(event) => setStudentLevel(event.target.value)} placeholder="e.g. Year 8" className="field" />
                        <button type="button" onClick={handleGenerate} disabled={generating} className="primary-button mt-4 w-full">{generating ? "Building lesson..." : "Generate lesson draft"}</button>
                        {!content && <div className="mt-6 rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500"><p className="font-semibold text-slate-700">Your lesson will appear here</p><p className="mt-2 leading-6">Objectives, explanations, examples, activities, and assessment prompts.</p></div>}
                    </section>

                    <form onSubmit={handleSubmit} className="workspace-card space-y-5 p-5 sm:p-6">
                        {error && (
                            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                                {error}
                            </p>
                        )}

                        {message && (
                            <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
                                {message}
                            </p>
                        )}

                        <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between"><p className="eyebrow">{structuredLesson ? "Generated lesson" : "Lesson note"}</p><div className="flex flex-wrap gap-3"><button type="button" onClick={startLessonEdit} className="primary-button min-h-10 px-4 py-2 text-sm">Edit lesson</button>{note && <button type="button" onClick={() => setDeleteOpen(true)} className="min-h-10 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Delete lesson</button>}</div></div>
                        {structuredLesson ? (
                            <article className="space-y-8 text-sm leading-7 text-slate-600">
                                <section>
                                    <p className="eyebrow">Lesson information</p>
                                    <dl className="mt-3 grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-2">
                                        {Object.entries(structuredLesson.lessonInfo || {}).filter(([, value]) => value).map(([key, value]) => <div key={key}><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">{key}</dt><dd className="font-semibold text-slate-800">{value}</dd></div>)}
                                    </dl>
                                </section>
                                <section><h2 className="section-title">Learning objectives</h2><ul className="mt-3 list-disc space-y-2 pl-5">{renderList(structuredLesson.objectives)}</ul></section>
                                {structuredLesson.materials?.length > 0 && <section><h2 className="section-title">Teaching and learning materials</h2><ul className="mt-3 list-disc space-y-2 pl-5">{renderList(structuredLesson.materials)}</ul></section>}
                                {structuredLesson.previousKnowledge && <section><h2 className="section-title">Previous knowledge</h2><p className="mt-3">{structuredLesson.previousKnowledge}</p></section>}
                                {structuredLesson.introduction && <section><h2 className="section-title">Introduction</h2><p className="mt-3"><strong>Teacher activity:</strong> {structuredLesson.introduction.teacherActivity}</p><p className="mt-2"><strong>Student activity:</strong> {structuredLesson.introduction.studentActivity}</p><p className="mt-2"><strong>Expected responses:</strong> {structuredLesson.introduction.expectedResponses?.join(" ")}</p></section>}
                                {structuredLesson.lessonDevelopment?.map((step) => <section key={step.step}><p className="eyebrow">Step {step.step}</p><h2 className="mt-2 section-title">{step.title}</h2><p className="mt-3"><strong>Teacher activity:</strong> {step.teacherActivity}</p><p className="mt-2"><strong>Student activity:</strong> {step.studentActivity}</p><p className="mt-2">{step.explanation}</p>{step.examples?.length > 0 && <ul className="mt-3 list-disc space-y-2 pl-5">{renderList(step.examples)}</ul>}{step.checkForUnderstanding?.length > 0 && <p className="mt-3"><strong>Check for understanding:</strong> {step.checkForUnderstanding.join(" ")}</p>}</section>)}
                                {structuredLesson.activities?.filter((activity) => activity.name).map((activity) => <section key={activity.name}><h2 className="section-title">{activity.name}</h2><p className="mt-3"><strong>Materials:</strong> {activity.materials?.join(", ")}</p><ol className="mt-3 list-decimal space-y-2 pl-5">{renderList(activity.procedure)}</ol><p className="mt-3"><strong>Expected result:</strong> {activity.expectedResult}</p></section>)}
                                {structuredLesson.evaluation && <section><h2 className="section-title">Evaluation</h2><ol className="mt-3 list-decimal space-y-2 pl-5">{renderList([...(structuredLesson.evaluation.oralQuestions || []), ...(structuredLesson.evaluation.shortAnswerQuestions || []), ...(structuredLesson.evaluation.multipleChoiceQuestions || []), ...(structuredLesson.evaluation.applicationQuestions || [])])}</ol><h3 className="mt-6 font-semibold text-slate-900">Teacher answer key</h3><ol className="mt-3 list-decimal space-y-2 pl-5">{renderList(structuredLesson.evaluation.answerKey)}</ol></section>}
                                {structuredLesson.summary?.length > 0 && <section><h2 className="section-title">Lesson summary</h2><ul className="mt-3 list-disc space-y-2 pl-5">{renderList(structuredLesson.summary)}</ul></section>}
                                {structuredLesson.homework?.length > 0 && <section><h2 className="section-title">Homework</h2><ol className="mt-3 list-decimal space-y-2 pl-5">{renderList(structuredLesson.homework)}</ol></section>}
                            </article>
                        ) : <div>
                            <label htmlFor="lessonContent" className="block text-sm font-semibold text-slate-700">
                                Lesson content
                            </label>
                            <textarea
                                id="lessonContent"
                                required
                                rows="16"
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                                placeholder="Write the lesson note here..."
                                className="field mt-2 min-h-80 resize-y"
                            />
                        </div>}

                        <div>
                            <label htmlFor="lessonStatus" className="block text-sm font-semibold text-slate-700">
                                Status
                            </label>
                            <select
                                id="lessonStatus"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="field mt-2 max-w-xs"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="primary-button w-full sm:w-auto"
                        >
                            {saving ? "Saving..." : note ? "Update lesson note" : "Create lesson note"}
                        </button>
                    </form>
                    </div>
                )}
                {editingLesson && createPortal(<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.65)' }} className="flex items-center justify-center overflow-y-auto p-4 backdrop-blur-sm" onClick={() => setEditingLesson(null)}><form onSubmit={handleStructuredSave} onClick={(event) => event.stopPropagation()} className="mx-auto my-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Lesson editor</p><h2 className="section-title mt-2">Edit lesson</h2></div><button type="button" onClick={() => setEditingLesson(null)} className="cursor-pointer text-sm font-semibold text-slate-500">Cancel</button></div><label htmlFor="lesson-title" className="mt-6 block text-sm font-semibold text-slate-700">Lesson topic</label><input id="lesson-title" className="field mt-2 rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" value={editingLesson.lessonInfo?.topic || ""} onChange={(event) => setEditingLesson({ ...editingLesson, lessonInfo: { ...editingLesson.lessonInfo, topic: event.target.value } })} /><label htmlFor="lesson-objectives" className="mt-5 block text-sm font-semibold text-slate-700">Learning objectives <span className="font-normal text-slate-400">(one per line)</span></label><textarea id="lesson-objectives" className="field mt-2 min-h-28 rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" value={arrayToLines(editingLesson.objectives)} onChange={(event) => setEditingLesson({ ...editingLesson, objectives: linesToArray(event.target.value) })} /><label htmlFor="lesson-materials" className="mt-5 block text-sm font-semibold text-slate-700">Materials <span className="font-normal text-slate-400">(one per line)</span></label><textarea id="lesson-materials" className="field mt-2 min-h-24 rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" value={arrayToLines(editingLesson.materials)} onChange={(event) => setEditingLesson({ ...editingLesson, materials: linesToArray(event.target.value) })} /><label htmlFor="lesson-previous" className="mt-5 block text-sm font-semibold text-slate-700">Previous knowledge</label><textarea id="lesson-previous" className="field mt-2 rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" value={editingLesson.previousKnowledge || ""} onChange={(event) => setEditingLesson({ ...editingLesson, previousKnowledge: event.target.value })} /><label htmlFor="lesson-introduction" className="mt-5 block text-sm font-semibold text-slate-700">Introduction</label><textarea id="lesson-introduction" className="field mt-2 min-h-28 rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" value={editingLesson.introduction?.teacherActivity || ""} onChange={(event) => setEditingLesson({ ...editingLesson, introduction: { ...editingLesson.introduction, teacherActivity: event.target.value } })} placeholder="Teacher activity" /><textarea aria-label="Student introduction activity" className="field mt-3 min-h-24 rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500" value={editingLesson.introduction?.studentActivity || ""} onChange={(event) => setEditingLesson({ ...editingLesson, introduction: { ...editingLesson.introduction, studentActivity: event.target.value } })} placeholder="Student activity" />{editingLesson.lessonDevelopment?.map((step, index) => <fieldset key={step.step || index} className="mt-6 rounded-lg border border-slate-200 p-4"><legend className="px-2 text-sm font-semibold text-slate-700">Step {step.step || index + 1}: {step.title}</legend><input className="field mt-2" aria-label={`Step ${index + 1} title`} value={step.title || ""} onChange={(event) => setEditingLesson({ ...editingLesson, lessonDevelopment: editingLesson.lessonDevelopment.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} /><textarea className="field mt-3 min-h-24" aria-label={`Step ${index + 1} teacher activity`} value={step.teacherActivity || ""} onChange={(event) => setEditingLesson({ ...editingLesson, lessonDevelopment: editingLesson.lessonDevelopment.map((item, itemIndex) => itemIndex === index ? { ...item, teacherActivity: event.target.value } : item) })} placeholder="Teacher activity" /><textarea className="field mt-3 min-h-24" aria-label={`Step ${index + 1} student activity`} value={step.studentActivity || ""} onChange={(event) => setEditingLesson({ ...editingLesson, lessonDevelopment: editingLesson.lessonDevelopment.map((item, itemIndex) => itemIndex === index ? { ...item, studentActivity: event.target.value } : item) })} placeholder="Student activity" /><textarea className="field mt-3 min-h-24" aria-label={`Step ${index + 1} explanation`} value={step.explanation || ""} onChange={(event) => setEditingLesson({ ...editingLesson, lessonDevelopment: editingLesson.lessonDevelopment.map((item, itemIndex) => itemIndex === index ? { ...item, explanation: event.target.value } : item) })} placeholder="Explanation" /></fieldset>)}<label htmlFor="lesson-summary" className="mt-6 block text-sm font-semibold text-slate-700">Lesson summary <span className="font-normal text-slate-400">(one point per line)</span></label><textarea id="lesson-summary" className="field mt-2" value={arrayToLines(editingLesson.summary)} onChange={(event) => setEditingLesson({ ...editingLesson, summary: linesToArray(event.target.value) })} /><label htmlFor="lesson-homework" className="mt-5 block text-sm font-semibold text-slate-700">Homework <span className="font-normal text-slate-400">(one item per line)</span></label><textarea id="lesson-homework" className="field mt-2" value={arrayToLines(editingLesson.homework)} onChange={(event) => setEditingLesson({ ...editingLesson, homework: linesToArray(event.target.value) })} /><div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setEditingLesson(null)} className="min-h-11 cursor-pointer rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" disabled={saving} className="primary-button cursor-pointer disabled:cursor-not-allowed">{saving ? "Saving..." : "Save changes"}</button></div></form></div>, document.body)}
                {deleteOpen && <ConfirmDialog title="Delete lesson?" message="This lesson note will be permanently removed. This action cannot be undone." busy={saving} onCancel={() => setDeleteOpen(false)} onConfirm={handleDeleteLesson} />}
            </main>
        </div>
    );
}
