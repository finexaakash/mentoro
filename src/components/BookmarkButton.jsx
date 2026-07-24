import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBookmark, toggleBookmark } from "../services/bookmarks";

const BookmarkButton = ({ item, onChanged, iconOnly = false }) => {
  const userData = useSelector((state) => state.auth.userData);
  const isStudent = userData?.prefs?.role === "student";
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isStudent || !item?.$id) return;
    getBookmark(item.$id).then((bookmark) => setSaved(Boolean(bookmark))).catch(() => setSaved(false));
  }, [isStudent, item?.$id]);

  if (!isStudent) return null;

  const handleBookmark = async () => {
    setLoading(true);
    try {
      const nowSaved = await toggleBookmark(item);
      setSaved(nowSaved);
      onChanged?.(nowSaved);
    } catch (error) {
      alert(error.message || "Could not update bookmark.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      aria-label={saved ? "Remove bookmark" : "Bookmark this resource"}
      title={saved ? "Remove bookmark" : "Bookmark this resource"}
      className={iconOnly
        ? `absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border transition disabled:opacity-50 ${saved ? "border-indigo-300 bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" : "border-indigo-400/40 bg-slate-900/80 text-indigo-300 hover:border-indigo-300 hover:bg-indigo-500/20"}`
        : "shrink-0 rounded-lg border border-indigo-400/50 px-3 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/10 disabled:opacity-50"}
    >
      {iconOnly ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75V22l-6-3.75L6 22V3.75Z" />
        </svg>
      ) : loading ? "Saving..." : saved ? "Saved" : "Bookmark"}
    </button>
  );
};

export default BookmarkButton;
