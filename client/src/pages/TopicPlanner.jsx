import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";



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
        <div className="min-h-screen overflow-x-hidden bg-slate-900 p-4 font-sans text-slate-100 sm:p-6 md:p-12">
            <Navbar />
            <main className="mx-auto max-w-6xl">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Scheme planner</p>
                <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h1 className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-4xl">Weekly topics</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">Turn objectives into a clear, teachable sequence. Select a topic to open its lesson note.</p></div><span className="text-sm text-slate-400">{topics.length} {topics.length === 1 ? "topic" : "topics"}</span></div>

                {error ? <p role="alert" className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{error}</p> : loading ? <p className="mt-8 text-slate-400">Loading topics...</p> : topics.length === 0 ? <p className="mt-8 rounded-xl border-2 border-dashed border-slate-800 p-8 text-center text-slate-500">No topics available yet. Add the first one below.</p> : <div className="mt-8 grid gap-4 md:grid-cols-2">{topics.map(tp => <Link key={tp.id} to={`/topics/${tp.id}/lesson`} className="group block rounded-xl border border-slate-700/60 bg-slate-800/50 p-6 text-slate-100 no-underline shadow-xl backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-indigo-500/80 hover:shadow-indigo-500/5"><div className="flex items-start justify-between gap-4"><span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">Week {tp.week}</span><span className="text-xl text-indigo-400 transition group-hover:translate-x-1">→</span></div><h2 className="mt-5 text-2xl font-bold text-slate-100">{tp.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{tp.objectives}</p><p className="mt-5 text-sm font-bold text-indigo-300">Open lesson note</p></Link>)}</div>}

                <form onSubmit={handleTopicSubmit} className="mt-12 max-w-3xl space-y-4 rounded-xl border border-slate-800 bg-slate-800/30 p-6">
                    <div><p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Quick action</p><h2 className="mt-2 text-2xl font-bold text-slate-100">Add a weekly topic</h2></div>
                    <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="weekNo" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">Week number</label>
                    <input
                        id="weekNo"
                        type="number"
                        min="1"
                        required
                        value={weekNo}
                        onChange={(e) => setWeekNo(e.target.value)}
                        placeholder="e.g. 1"
                        className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="topicTitle" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">Topic</label>
                    <input
                        id="topicTitle"
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Cell structure"
                        className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="objectives" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">Objective</label>
                    <textarea
                        id="objectives"
                        required
                        value={objectives}
                        onChange={(e) => setObjectives(e.target.value)}
                        placeholder="What should students learn?"
                        className="min-h-32 w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none"
                    />
                </div>

                    <button type="submit" className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-indigo-600/10 transition duration-150 hover:bg-indigo-500 active:scale-95 sm:col-span-2 sm:w-auto">Add topic</button></div>
            </form>
            </main>
        </div>
    )
}