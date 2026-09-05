import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";



export default function TopicPlanner(){
    const { schemeId} = useParams();
    const [topics, setTopics] = useState([]);
    const [title, setTitle] = useState("");
    const [objectives, setObjectives] = useState("");
    const [weekNo, setWeekNo] = useState("")
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    const fetchSchemeTopics = async()=>{
        try{
            const topicResponse = await API.get(`\/topics/scheme/${schemeId}`);
            setTopics(topicResponse.data.data);
            setLoading(false)
        }catch(err){
            setError(err.response?.data?.error?.message || "Failed to fetch topics");
            setLoading(false);
        }

        
    }

    useEffect(()=>{
        fetchSchemeTopics();

    }, []);

    const handleTopicSubmit = async(e)=>{
        e.preventDefault();
        try{
            await API.post('/topics', {title, objectives, week: weekNo, schemeId});
            setTitle("");
            setObjectives("");
            setWeekNo("");
            fetchSchemeTopics();
        }catch{

        }       
    }

    return (
        <div className="overflow-x-hidden p-4 sm:p-6 lg:p-10">
            <main className="mx-auto max-w-6xl">
                <p className="eyebrow">Scheme planner</p>
                <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h1 className="page-title">Weekly topics</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">Turn objectives into a clear, teachable sequence. Select a topic to open its lesson note.</p></div><span className="text-sm text-slate-400">{topics.length} {topics.length === 1 ? "topic" : "topics"}</span></div>

                {error ? <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">Something went wrong. {error}</p> : loading ? <p className="mt-8 text-slate-500">Loading topics...</p> : topics.length === 0 ? <p className="mt-8 border-2 border-dashed border-slate-200 p-8 text-center text-slate-500">Your scheme is ready for its first topic.</p> : <div className="mt-8 grid gap-4 md:grid-cols-2">{topics.map(tp => <Link key={tp.id} to={`/topics/${tp.id}/lesson`} className="workspace-card workspace-card-interactive group block p-6 no-underline"><div className="flex items-start justify-between gap-4"><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Week {tp.week}</span><span className="text-xl text-indigo-600 transition group-hover:translate-x-1">→</span></div><h2 className="mt-5 text-lg font-semibold text-slate-900">{tp.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{tp.objectives}</p><p className="mt-5 text-sm font-semibold text-indigo-600">Open lesson note</p></Link>)}</div>}

                <form onSubmit={handleTopicSubmit} className="workspace-card mt-12 max-w-3xl space-y-4 p-6">
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

                    <button type="submit" className="primary-button w-full sm:col-span-2 sm:w-auto">Add topic</button></div>
            </form>
            </main>
        </div>
    )
}