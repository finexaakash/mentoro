import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRatingSummary, saveRating } from "../services/ratings";

const Star = ({ filled }) => <span aria-hidden="true" className={filled ? "text-indigo-300 drop-shadow-[0_0_5px_rgba(129,140,248,0.45)]" : "text-white/20"}>★</span>;

const ResourceRating = ({ resource }) => {
  const userData = useSelector((state) => state.auth.userData);
  const isStudent = userData?.prefs?.role === "student";
  const [summary, setSummary] = useState({ average: 0, count: 0, mine: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!resource?.$id) return;
    setLoading(true);
    try {
      setSummary(await getRatingSummary(resource.$id, userData?.$id));
      setError("");
    } catch (err) {
      setError(err.message || "Could not load ratings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [resource?.$id, userData?.$id]);

  const rate = async (value) => {
    setSaving(true);
    try {
      setSummary(await saveRating(resource.$id, value));
      setError("");
    } catch (err) {
      setError(err.message || "Could not save your rating.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="flex gap-0.5" aria-label={`${summary.average.toFixed(1)} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((star) => <Star key={star} filled={star <= Math.round(summary.average)} />)}
        </span>
        <span className="text-xs text-gray-400">
          {loading ? "Loading rating..." : summary.count ? `${summary.average.toFixed(1)} / 5 (${summary.count})` : "No ratings yet"}
        </span>
      </div>

      {isStudent && (
        <div className="mt-2 flex items-center gap-1" aria-label="Rate this resource">
          <span className="mr-1 text-xs text-gray-400">Your rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => rate(star)}
              disabled={saving}
              aria-label={`Rate ${star} out of 5 stars`}
              className={`text-xl leading-none transition hover:scale-110 disabled:opacity-50 ${star <= summary.mine ? "text-indigo-300" : "text-white/20 hover:text-indigo-200"}`}
            >
              ★
            </button>
          ))}
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
};

export default ResourceRating;
