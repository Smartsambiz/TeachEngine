import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function LessonNote() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("draft");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

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

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-900 p-4 font-sans text-slate-100 sm:p-6 md:p-12">
            <Navbar />
            <main className="mx-auto max-w-4xl">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-sm font-bold text-indigo-400 hover:text-indigo-300"
                >
                    Back to topics
                </button>

                <div className="mt-8 border-b border-slate-800 pb-8"><p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Lesson note</p><h1 className="mt-3 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-4xl">A focused space for the lesson</h1><p className="mt-3 text-slate-400">Write the explanation, examples, and prompts your future self will need.</p></div>

                {loading ? (
                    <p className="mt-8 text-slate-400">Loading lesson note...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-4 rounded-xl border border-slate-800 bg-slate-800/30 p-6">
                        {error && (
                            <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300">
                                {error}
                            </p>
                        )}

                        {message && (
                            <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300">
                                {message}
                            </p>
                        )}

                        <div>
                            <label htmlFor="lessonContent" className="block text-sm font-semibold uppercase tracking-wider text-slate-400">
                                Lesson content
                            </label>
                            <textarea
                                id="lessonContent"
                                required
                                rows="16"
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                                placeholder="Write the lesson note here..."
                                className="mt-2 min-h-80 w-full resize-y rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="lessonStatus" className="block text-sm font-semibold uppercase tracking-wider text-slate-400">
                                Status
                            </label>
                            <select
                                id="lessonStatus"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="mt-2 w-full max-w-xs rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 transition focus:border-indigo-500 focus:outline-none"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-indigo-600/10 transition duration-150 hover:bg-indigo-500 active:scale-95 sm:w-auto"
                        >
                            {saving ? "Saving..." : note ? "Update lesson note" : "Create lesson note"}
                        </button>
                    </form>
                )}
            </main>
        </div>
    );
}
