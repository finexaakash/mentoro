

import { useEffect, useState } from "react";
import { databases, account } from "../lib/appwrite";
import conf from "../conf/conf";
import { Query } from "appwrite";
import { useParams, useNavigate } from "react-router-dom";

const TeacherResources = () => {
  const { type } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const LIMIT = 20;
  const CACHE_TIME = 5 * 60 * 1000;

  const AUTH_KEY = "auth-cache";
  const getCacheKey = (page) => `my-resources-${type}-page-${page}`;

  const fetchData = async (pageNumber) => {
    const cacheKey = getCacheKey(pageNumber);
    const cache = JSON.parse(localStorage.getItem(cacheKey));

    if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
      setData(cache.data);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      let user;

      const authCache = JSON.parse(localStorage.getItem(AUTH_KEY));

      if (authCache && Date.now() - authCache.timestamp < CACHE_TIME) {
        user = authCache.user;
      } else {
        user = await account.get();
        localStorage.setItem(
          AUTH_KEY,
          JSON.stringify({
            user,
            timestamp: Date.now(),
          })
        );
      }

      const res = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteResourcesCollectionId,
        [
          Query.equal("userId", user.$id),
          Query.equal("type", type),
          Query.limit(LIMIT),
          Query.offset((pageNumber - 1) * LIMIT),
          Query.orderDesc("$createdAt"),
        ]
      );

      setData(res.documents);

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: res.documents,
          timestamp: Date.now(),
        })
      );

    } catch (error) {
      console.log("❌ Fetch Error:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page, type]);

  const handleRefresh = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`my-resources-${type}`)) {
        localStorage.removeItem(key);
      }
    });

    setLoading(true);
    fetchData(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="animate-pulse text-lg">Loading {type}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-6 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div>
          <h2 className="text-3xl font-bold capitalize">
            {type} 📚
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage and share your {type}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
          >
            🔄 Refresh
          </button>

          <button
            onClick={() => navigate(`/add/${type}`)}
            className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 font-semibold transition"
          >
            + Add New
          </button>
        </div>
      </div>

      {/* EMPTY */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <p className="text-lg">No {type} added yet</p>
        </div>
      ) : (
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {data.map((item) => (
            <div
              key={item.$id}
              className="
                relative group
                p-5 rounded-2xl
                bg-white/5 border border-white/10
                transition duration-300
                hover:scale-[1.03]
                hover:shadow-xl

                shadow-[0_0_0px_rgba(99,102,241,0)]
                group-hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]
                group-hover:border-indigo-400/40
              "
            >

              {/* INNER GLOW */}
              <div
                className="
                  absolute inset-0 rounded-2xl
                  opacity-0 group-hover:opacity-100
                  transition duration-300
                  pointer-events-none
                  bg-gradient-to-br from-indigo-500/10 to-purple-500/10
                "
              ></div>

              <div className="relative z-10">

                <h3 className="text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400 mt-2">
                  {item.description}
                </p>

                {/* ACTIONS */}
                <div className="flex mt-6 gap-2">

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex-1 text-center
                      bg-indigo-500/20 hover:bg-indigo-500/30
                      p-2 rounded transition
                    "
                  >
                    Open
                  </a>

                  <button
                    onClick={() => navigate(`/edit/${item.$id}/${type}`)}
                    className="
                      flex-1 bg-yellow-500/20 hover:bg-yellow-500/30
                      p-2 rounded transition
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={async () => {
                      if (!confirm("Delete this resource?")) return;

                      try {
                        await databases.deleteDocument(
                          conf.appwriteDatabaseId,
                          conf.appwriteResourcesCollectionId,
                          item.$id
                        );

                        setData((prev) =>
                          prev.filter((i) => i.$id !== item.$id)
                        );

                        Object.keys(localStorage).forEach((key) => {
                          if (key.startsWith(`my-resources-${type}`)) {
                            localStorage.removeItem(key);
                          }
                        });

                      } catch (err) {
                        console.log("Delete error:", err);
                      }
                    }}
                    className="
                      flex-1 bg-red-500/20 hover:bg-red-500/30
                      p-2 rounded transition
                    "
                  >
                    Delete
                  </button>

                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Type: {type}
                </div>

              </div>
            </div>
          ))}

        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-10">

        
        {/* PREVIOUS */}
<button
  onClick={() => setPage((p) => Math.max(1, p - 1))}
  disabled={page === 1}
  className={`
    px-5 py-2 rounded-lg transition duration-300

    ${
      page === 1
        ? "border border-white/20 opacity-30 cursor-not-allowed"
        : "border border-white/20 hover:border-indigo-400 hover:text-indigo-300 hover:-translate-y-[1px] "
    }
  `}
>
  ← Previous
</button>

<span className="text-gray-400">Page {page}</span>

{/* NEXT */}
<button
  onClick={() => setPage((p) => p + 1)}
  disabled={data.length < LIMIT}
  className={`
    px-5 py-2 rounded-lg transition duration-300

    ${
      data.length < LIMIT
        ? "bg-indigo-400 opacity-30 cursor-not-allowed"
        : "bg-indigo-500 hover:bg-indigo-600 hover:-translate-y-[1px] "
    }
  `}
>
  Next →
</button>

      </div>

    </div>
  );
};

export default TeacherResources;