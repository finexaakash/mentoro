
import { useEffect, useState, useRef } from "react";
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
  const [maxPage, setMaxPage] = useState(1); // 🔥 FIX

  const LIMIT = 20;
  const CACHE_TIME = 5 * 60 * 1000;

  const debounceRef = useRef(null);

  const getCacheKey = (page) => `resources-${type}-page-${page}`;
  const TEACHER_CACHE = "teachers-global";

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
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
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

      {/* DATA */}
      {data.length === 0 ? (
        <div className="flex items-center justify-center mt-20 text-gray-400">
          No {type} available yet
        </div>
      ) : (
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
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