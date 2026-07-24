import { useEffect, useState } from "react";
import ResourceCard from "../components/ResourceCard";
import { listBookmarks } from "../services/bookmarks";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookmarks = async () => {
    setLoading(true);
    setError("");
    try {
      setBookmarks(await listBookmarks());
    } catch (err) {
      setError(err.message || "Could not load bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  if (loading) return <div className="min-h-screen py-16 text-center text-gray-300">Loading bookmarks...</div>;

  return (
    <div className="mx-auto min-h-screen max-w-6xl py-8 text-white">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My bookmarks</h1>
          <p className="mt-2 text-sm text-gray-400">Resources you saved for later.</p>
        </div>
        <button onClick={loadBookmarks} className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:border-indigo-400 hover:text-indigo-200">Refresh</button>
      </div>

      {error && <p className="rounded-lg bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
      {!error && bookmarks.length === 0 && <p className="rounded-lg border border-dashed border-white/20 p-8 text-center text-gray-400">You have not bookmarked any resources yet.</p>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <ResourceCard
            key={bookmark.$id}
            item={{
              $id: bookmark.resourceId,
              type: bookmark.resourceType,
              title: bookmark.title,
              description: bookmark.description,
              link: bookmark.link,
              userId: bookmark.teacherId,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
