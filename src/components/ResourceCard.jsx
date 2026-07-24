import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AiSummaryModal from "./AiSummaryModal";
import AiMcqModal from "./AiMcqModal";
import { trackResourceOpen } from "../services/analytics";
import BookmarkButton from "./BookmarkButton";
import ResourceRating from "./ResourceRating";
import { getSafeExternalUrl } from "../utils/links";

const ResourceCard = ({ item, teacher }) => {
  const navigate = useNavigate();
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [mcqOpen, setMcqOpen] = useState(false);
  const isNote = String(item.type || "").toLowerCase() === "notes";
  const safeLink = getSafeExternalUrl(item.link);

  return (
    <>
      <div className="relative group p-5 rounded-2xl bg-white/5 border border-white/10 transition duration-300 hover:scale-[1.03] hover:shadow-xl shadow-[0_0_0px_rgba(99,102,241,0)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]">
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
        <BookmarkButton item={item} iconOnly />
        <div className="relative z-10">
          <h3 className="pr-10 text-lg font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-400 mt-2 line-clamp-3">{item.description}</p>
          <ResourceRating resource={item} />
          {teacher && (
            <div onClick={() => navigate(`/teacher/${teacher.userId}`)} className="mt-3 flex items-center gap-2 cursor-pointer hover:text-indigo-400 transition">
              <span className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-400 rounded-md">Teacher</span>
              <span className="text-sm text-gray-300">{teacher.name}</span>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {safeLink ? (
              <a href={safeLink} target="_blank" rel="noopener noreferrer" onClick={() => trackResourceOpen(item)} className="inline-block px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium transition">Open →</a>
            ) : (
              <span className="inline-block cursor-not-allowed rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-300">Invalid link</span>
            )}
            <button onClick={() => setSummaryOpen(true)} className="rounded-lg border border-indigo-400/50 px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/10">AI summary</button>
            {isNote && <button onClick={() => setMcqOpen(true)} className="rounded-lg border border-purple-400/50 px-4 py-2 text-sm font-medium text-purple-200 hover:bg-purple-500/10">AI MCQs</button>}
          </div>
        </div>
      </div>
      {summaryOpen && <AiSummaryModal item={item} onClose={() => setSummaryOpen(false)} />}
      {mcqOpen && <AiMcqModal item={item} onClose={() => setMcqOpen(false)} />}
    </>
  );
};

export default ResourceCard;
