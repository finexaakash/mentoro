
import { useEffect, useMemo, useState, useRef } from "react";
import { databases } from "../lib/appwrite";
import conf from "../conf/conf";
import { Query } from "appwrite";
import { useParams } from "react-router-dom";
import ResourceCard from "../components/ResourceCard";

const ExploreResources = () => {
  const { type } = useParams();

  const [data, setData] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [maxPage, setMaxPage] = useState(1); // 🔥 FIX

  const LIMIT = 20;
  const CACHE_TIME = 5 * 60 * 1000;

  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  const getCacheKey = (page) => `resources-${type}-page-${page}`;
  const TEACHER_CACHE = "teachers-global";

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data;

    return data.filter((item) => {
      const teacher = teachers[item.userId];
      return [item.title, item.description, teacher?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [data, searchQuery, teachers]);

  // 🔥 FETCH FUNCTION
  const fetchFromAPI = async (pageNumber) => {
    const cacheKey = getCacheKey(pageNumber);
    const cache = JSON.parse(localStorage.getItem(cacheKey));

    // ✅ CACHE FIRST
    if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
      setData(cache.data);
      setTeachers(cache.teachers);

      // 🔥 FIX maxPage from cache
      if (cache.data.length === LIMIT) {
        setMaxPage(pageNumber + 1);
      } else {
        setMaxPage(pageNumber);
      }

      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteResourcesCollectionId,
        [
          Query.equal("type", type),
          Query.limit(LIMIT),
          Query.offset((pageNumber - 1) * LIMIT),
          Query.orderDesc("$createdAt"),
        ]
      );

      // 🔥 FIX maxPage (IMPORTANT)
      if (res.documents.length === LIMIT) {
        setMaxPage(pageNumber + 1);
      } else {
        setMaxPage(pageNumber);
      }

      let teacherMap = {};
      const teacherCache = JSON.parse(localStorage.getItem(TEACHER_CACHE));

      if (teacherCache && Date.now() - teacherCache.timestamp < CACHE_TIME) {
        teacherMap = teacherCache.data;
      } else {
        const teacherRes = await databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId
        );

        teacherRes.documents.forEach((t) => {
          teacherMap[t.userId] = t;
        });

        localStorage.setItem(
          TEACHER_CACHE,
          JSON.stringify({
            data: teacherMap,
            timestamp: Date.now(),
          })
        );
      }

      setData(res.documents);
      setTeachers(teacherMap);

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: res.documents,
          teachers: teacherMap,
          timestamp: Date.now(),
        })
      );

    } catch (err) {
      console.log("❌ Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DEBOUNCE FETCH (KEEP THIS)
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchFromAPI(page);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [page, type]);

  useEffect(() => {
    setSearchQuery("");
    setSearchExpanded(false);
  }, [type]);

  useEffect(() => {
    const collapseSearch = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchExpanded(false);
      }
    };
    document.addEventListener("mousedown", collapseSearch);
    return () => document.removeEventListener("mousedown", collapseSearch);
  }, []);

  // 🔄 REFRESH
  const handleRefresh = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`resources-${type}`)) {
        localStorage.removeItem(key);
      }
    });

    setPage(1);
    setMaxPage(1);
    fetchFromAPI(1);
  };

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="animate-pulse text-lg">
          Loading {type}...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-6 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-3 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold capitalize">
            {type} 📚
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Explore all {type} shared by teachers
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      <div ref={searchRef} className={`mx-auto mb-8 flex max-w-6xl ${searchExpanded ? "justify-center" : "justify-end"}`}>
        <div className={`w-full ${searchExpanded ? "max-w-4xl" : "max-w-md"}`}>
        {!searchExpanded ? (
          <button
            onClick={() => setSearchExpanded(true)}
            className="ml-auto flex items-center gap-2 rounded-full border border-indigo-400/35 bg-indigo-500/10 px-5 py-2.5 text-sm font-medium text-indigo-100 shadow-lg shadow-indigo-950/20 transition hover:border-indigo-300 hover:bg-indigo-500/20"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
            {searchQuery ? `${filteredData.length} result${filteredData.length === 1 ? "" : "s"} for “${searchQuery}”` : `Search ${type}`}
          </button>
        ) : (
          <div className="rounded-2xl border border-indigo-400/25 bg-gradient-to-r from-indigo-500/10 via-white/[0.04] to-purple-500/10 p-4 shadow-lg shadow-indigo-950/20">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-200">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
              </div>
              <div>
                <label htmlFor="resource-search" className="text-sm font-medium text-white">Find study resources</label>
                <p className="text-xs text-gray-400">Search by title, topic, description, or teacher</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-1 transition focus-within:border-indigo-400/70 focus-within:ring-2 focus-within:ring-indigo-500/15">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
              <input
                id="resource-search"
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={`Search ${type}`}
                className="w-full bg-transparent py-3 text-sm text-white placeholder:text-gray-500 outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-indigo-200 hover:bg-indigo-500/15 hover:text-white">Clear</button>
              )}
            </div>
            {searchQuery && <p className="mt-3 text-sm text-indigo-200">{filteredData.length} matching resource{filteredData.length === 1 ? "" : "s"} on this page</p>}
          </div>
        )}
        </div>
      </div>

      {/* DATA */}
      {data.length === 0 ? (
        <div className="flex items-center justify-center mt-20 text-gray-400">
          No {type} available yet
        </div>
      ) : filteredData.length === 0 ? (
        <div className="mt-20 flex items-center justify-center text-gray-400">
          No {type} match your search on this page
        </div>
      ) : (
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <ResourceCard
              key={item.$id}
              item={item}
              teacher={teachers[item.userId]}
            />
          ))}
        </div>
        
      )}
      

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-10">

        {/* PREVIOUS */}
        <button
          onClick={() => {
            if (!loading) {
              setPage((p) => Math.max(1, p - 1));
            }
          }}
          disabled={loading || page === 1}
          className="px-5 py-2 border border-white/20 rounded-lg disabled:opacity-30"
        >
          ← Previous
        </button>

        <span className="text-gray-400">Page {page}</span>

        {/* NEXT */}
        <button
          onClick={() => {
            if (!loading && page < maxPage) {
              // setPage((p) => p + 1);

              setPage(page + 1);
            }
          }}
          disabled={loading || page >= maxPage}
          className="px-5 py-2 bg-indigo-500 rounded-lg disabled:opacity-30"
        >
          Next →
        </button>

      </div>
    </div>
  );
};

export default ExploreResources;
