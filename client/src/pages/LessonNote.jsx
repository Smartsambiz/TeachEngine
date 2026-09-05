import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

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
                                <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-semibold text-slate-700">Edit structured lesson data</summary><textarea aria-label="Structured lesson content" value={content} onChange={(event) => setContent(event.target.value)} className="field mt-4 min-h-64 resize-y font-mono text-xs" /></details>
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
            </main>
        </div>
    );
}
