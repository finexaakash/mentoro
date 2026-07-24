import { useState } from "react";
import { createNoteMcqs } from "../services/aiSummary";

const AiMcqModal = ({ item, onClose }) => {
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

  const generateMcqs = async () => {
    setLoading(true);
    setError("");
    setShowAnswers(false);
    try {
      const result = await createNoteMcqs({
        title: item.title,
        text: item.notesText || item.description,
        count: 5,
      });
      if (!Array.isArray(result) || result.length === 0) throw new Error("The AI did not return any questions.");
      setMcqs(result);
    } catch (err) {
      setError(err.message || "Could not create MCQs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="mcq-title">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><h2 id="mcq-title" className="text-xl font-bold text-white">AI practice MCQs</h2><p className="mt-1 text-sm text-slate-400">{item.title}</p></div>
          <button onClick={onClose} className="text-slate-300 hover:text-white" aria-label="Close MCQs">✕</button>
        </div>

        {!mcqs.length && !loading && !error && <p className="mt-5 text-sm text-slate-300">Generate five practice questions from this note. Answers stay hidden until you choose to reveal them.</p>}
        {loading && <p className="mt-6 animate-pulse text-indigo-300">Creating practice questions…</p>}
        {error && <p className="mt-5 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

        {mcqs.length > 0 && (
          <div className="mt-5 max-h-80 space-y-5 overflow-y-auto pr-1">
            {mcqs.map((mcq, index) => (
              <div key={`${mcq.question}-${index}`} className="rounded-xl bg-white/5 p-4 text-sm text-slate-200">
                <p className="font-medium">{index + 1}. {mcq.question}</p>
                <ol className="mt-3 list-[upper-alpha] space-y-1 pl-6 text-slate-300">
                  {mcq.options?.map((option, optionIndex) => <li key={`${option}-${optionIndex}`}>{option}</li>)}
                </ol>
                {showAnswers && <p className="mt-3 text-emerald-300">Answer: {mcq.answer}. {mcq.explanation}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white">Close</button>
          {mcqs.length > 0 && <button onClick={() => setShowAnswers((value) => !value)} className="rounded-lg border border-indigo-400/50 px-4 py-2 text-sm font-medium text-indigo-200">{showAnswers ? "Hide answers" : "Show answers"}</button>}
          <button onClick={generateMcqs} disabled={loading} className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50">{mcqs.length ? "Generate again" : "Generate MCQs"}</button>
        </div>
      </div>
    </div>
  );
};

export default AiMcqModal;
