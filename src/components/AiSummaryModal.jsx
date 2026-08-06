import { useState } from "react";
import { createNoteSummary } from "../services/aiSummary";

const formatSummary = (value) => value
  .replace(/^\s{0,3}#{1,6}\s*/gm, "")
  .replace(/^\s*[-*+]\s+/gm, "• ")
  .trim();

const AiSummaryModal = ({ item, onClose }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sourceText = item.notesText || item.description;

  const generateSummary = async () => {
    setLoading(true); setError("");
    try { setSummary(formatSummary(await createNoteSummary({ title: item.title, text: sourceText }))); }
    catch (err) { setError(err.message || "Could not create the summary."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="summary-title">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><h2 id="summary-title" className="text-xl font-bold text-white">AI study summary</h2><p className="mt-1 text-sm text-slate-400">{item.title}</p></div>
          <button onClick={onClose} className="text-slate-300 hover:text-white" aria-label="Close summary">✕</button>
        </div>
        {!summary && !loading && !error && <p className="mt-5 text-sm leading-6 text-slate-300">This summarizes the study text supplied by the teacher. It cannot open or read a private Google Drive link.</p>}
        {loading && <p className="mt-6 animate-pulse text-indigo-300">Creating your study summary…</p>}
        {error && <p className="mt-5 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        {summary && <div className="mt-5 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-xl bg-white/5 p-4 text-sm leading-6 text-slate-200">{summary}</div>}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white">Close</button>
          <button onClick={generateSummary} disabled={loading} className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50">{summary ? "Generate again" : "Generate summary"}</button>
        </div>
      </div>
    </div>
  );
};
export default AiSummaryModal;
