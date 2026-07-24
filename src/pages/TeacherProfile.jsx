

import { useEffect, useState } from "react";
import { databases, storage } from "../lib/appwrite";
import conf from "../conf/conf";
import { Query } from "appwrite";
import { useParams } from "react-router-dom";
import { trackResourceOpen } from "../services/analytics";
import AiSummaryModal from "../components/AiSummaryModal";
import AiMcqModal from "../components/AiMcqModal";
import BookmarkButton from "../components/BookmarkButton";
import ResourceRating from "../components/ResourceRating";
import { getSafeExternalUrl } from "../utils/links";

const TYPES = ["notes", "books", "videos", "links"];

const TeacherProfile = () => {
  const { userId } = useParams();

  const [teacher, setTeacher] = useState(null);
  const [resources, setResources] = useState({
    notes: [],
    books: [],
    videos: [],
    links: [],
  });

  const [pages, setPages] = useState({
    notes: 1,
    books: 1,
    videos: 1,
    links: 1,
  });

  const [loading, setLoading] = useState(true);
  const [aiAction, setAiAction] = useState(null);

  const LIMIT = 10;
  const CACHE_TIME = 5 * 60 * 1000;

  const getCacheKey = (type, page) =>
    `teacher-${userId}-${type}-page-${page}`;

  // 🔥 FETCH TEACHER
  const fetchTeacher = async () => {
    try {
      const res = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("userId", userId)]
      );

      const profile = res.documents[0] || null;
      setTeacher(profile);
      return profile;
    } catch (err) {
      console.log("Teacher fetch error:", err);
    }
  };

  // 🔥 FETCH RESOURCES (WITH FORCE OPTION)
  const fetchResources = async (type, page, force = false) => {
    const cacheKey = getCacheKey(type, page);
    const cache = JSON.parse(localStorage.getItem(cacheKey));

    // ✅ USE CACHE (only if NOT force)
    if (!force && cache && Date.now() - cache.timestamp < CACHE_TIME) {
      setResources((prev) => ({ ...prev, [type]: cache.data }));
      return;
    }

    try {
      const res = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteResourcesCollectionId,
        [
          Query.equal("userId", userId),
          Query.equal("type", type),
          Query.limit(LIMIT),
          Query.offset((page - 1) * LIMIT),
          Query.orderDesc("$createdAt"),
        ]
      );

      setResources((prev) => ({ ...prev, [type]: res.documents }));

      // ✅ SAVE CACHE
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: res.documents,
          timestamp: Date.now(),
        })
      );

    } catch (err) {
      console.log("Resource fetch error:", err);
    }
  };

  // 🔥 INITIAL LOAD
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const profile = await fetchTeacher();
      if (!profile || profile.isPublic === false) {
        setLoading(false);
        return;
      }
      await Promise.all(
        TYPES.map((type) => fetchResources(type, pages[type]))
      );

      setLoading(false);
    };

    load();
  }, [userId]);

  // 🔄 PAGE CHANGE
  const changePage = (type, direction) => {
    setPages((prev) => {
      const newPage =
        direction === "next"
          ? prev[type] + 1
          : Math.max(1, prev[type] - 1);

      fetchResources(type, newPage);

      return { ...prev, [type]: newPage };
    });
  };

  // 🔄 REFRESH (FIXED)
  const handleRefresh = async () => {
    setLoading(true);

    // 🧹 CLEAR CACHE
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`teacher-${userId}`)) {
        localStorage.removeItem(key);
      }
    });

    // 🔥 FORCE FETCH
    await Promise.all(
      TYPES.map((type) =>
        fetchResources(type, pages[type], true)
      )
    );

    setLoading(false);
  };

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!teacher || teacher.isPublic === false) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">This teacher profile is not available.</div>;
  }

  return (
    <div className="min-h-screen text-white px-6 md:px-12 py-10">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-xl text-gray-300">Teacher Profile</h1>

        <button
          onClick={handleRefresh}
          className="bg-indigo-600 px-4 py-2 rounded-lg text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {/* TEACHER INFO */}
      {/* {teacher && (
        <div className="max-w-5xl mx-auto mb-12 bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-6 items-center">
          <img
            src={
              teacher.imageId
                ? storage
                    .getFileView(conf.appwriteBucketId, teacher.imageId)
                    .toString()
                : "https://via.placeholder.com/150"
            }
            className="w-28 h-28 rounded-full object-cover"
          />

          <div>
            <h1 className="text-2xl font-bold">{teacher.name}</h1>
            <p className="text-indigo-400">{teacher.designation}</p>
            <p className="text-gray-400 mt-2">{teacher.about}</p>
          </div>
        </div>
      )} */}
      {teacher && (
  <div
    className="
      max-w-5xl mx-auto mb-12
      bg-white/5 border border-white/10
      rounded-2xl p-6

      flex flex-col sm:flex-row
      gap-5 items-center sm:items-start
      text-center sm:text-left

      overflow-hidden
    "
  >

    {/* 🔥 PROFILE IMAGE */}
    <img
      src={
        teacher.imageId
          ? storage
              .getFileView(conf.appwriteBucketId, teacher.imageId)
              .toString()
          : "https://via.placeholder.com/150"
      }
      alt="profile"
      className="
        w-24 h-24 sm:w-28 sm:h-28
        rounded-full object-cover
        border border-white/20
        flex-shrink-0
      "
      onError={(e) => {
        e.target.src = "https://via.placeholder.com/150";
      }}
    />

    {/* 🔥 CONTENT */}
    <div className="flex-1 min-w-0">

      {/* NAME */}
      <h1 className="text-xl sm:text-2xl font-bold truncate">
        {teacher.name}
      </h1>

      {/* DESIGNATION */}
      <p
        className="
          text-indigo-400 text-sm sm:text-base
          break-all line-clamp-2
        "
      >
        {teacher.designation}
      </p>

      {/* ABOUT */}
      <p
        className="
          text-gray-400 mt-2 text-sm sm:text-base
          break-all line-clamp-3 sm:line-clamp-none
        "
      >
        {teacher.about}
      </p>

    </div>
  </div>
)}

      {/* SECTIONS */}
      {TYPES.map((type) => (
        <div key={type} className="mb-12 max-w-6xl mx-auto">

          <h2 className="text-xl font-semibold mb-6 capitalize">
            {type} 📚
          </h2>

          {resources[type].length === 0 ? (
            <p className="text-gray-500">No {type} available</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources[type].map((item) => (

<div
              key={item.$id}
              className="
                relative group
                bg-white/5 p-5 rounded-2xl
                border border-white/10
                overflow-hidden
                hover:scale-[1.03] hover:shadow-2xl
                transition duration-300
              "
            >

              {/* 🔥 Glow */}
              <div
                className="
                  absolute inset-0
                  bg-gradient-to-br from-indigo-500/20 to-purple-500/10
                  opacity-0 group-hover:opacity-100
                  transition duration-300
                  blur-xl pointer-events-none
                "
              ></div>
              <BookmarkButton item={item} iconOnly />
                     
                    <h3 className="pr-10 font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-400 mt-2">
                      {item.description}
                    </p>
                    <ResourceRating resource={item} />

                    <div className="mt-4 flex flex-nowrap items-center gap-2 overflow-x-auto pb-1">
                      {getSafeExternalUrl(item.link) ? <a
                        href={getSafeExternalUrl(item.link)}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => trackResourceOpen(item)}
  className="
    inline-flex w-20 shrink-0 items-center justify-center text-center
    bg-indigo-500 hover:bg-indigo-600
    text-white text-sm font-medium
    py-2 rounded-lg
    transition duration-200
  "
>
  Open →
                      </a> : <span className="inline-flex w-20 shrink-0 items-center justify-center rounded-lg bg-slate-700 py-2 text-sm text-slate-300">Invalid link</span>}
                    <button
                      onClick={() => setAiAction({ type: "summary", item })}
                      className="shrink-0 rounded-lg border border-indigo-400/50 px-3 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/10"
                    >
                      AI summary
                    </button>
                    {type === "notes" && (
                      <button
                        onClick={() => setAiAction({ type: "mcq", item })}
                        className="shrink-0 rounded-lg border border-purple-400/50 px-3 py-2 text-sm font-medium text-purple-200 hover:bg-purple-500/10"
                      >
                        AI MCQs
                      </button>
                    )}
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center gap-4 mt-6">
                
                <button
  onClick={() => changePage(type, "prev")}
  disabled={pages[type] === 1}
  className={`
    px-4 py-2 rounded font-medium
    transition-all duration-300

    ${
      pages[type] === 1
        ? "border border-white/20 opacity-30 cursor-not-allowed"
        : "border border-white/20 hover:border-indigo-400 hover:text-indigo-300 hover:-translate-y-[1px] "
    }
  `}
>
  ← Prev
</button>

                <span>Page {pages[type]}</span>

                
                <button
  onClick={() => changePage(type, "next")}
  disabled={resources[type].length < LIMIT}
  className={`
    px-4 py-2 rounded font-medium
    transition-all duration-300

    ${
      resources[type].length < LIMIT
        ? "bg-indigo-400 opacity-30 cursor-not-allowed"
        : "bg-indigo-500 hover:bg-indigo-600 hover:-translate-y-[1px] "
    }
  `}
>
  Next →
</button>
              </div>
            </>
          )}
        </div>
      ))}
      {aiAction?.type === "summary" && (
        <AiSummaryModal item={aiAction.item} onClose={() => setAiAction(null)} />
      )}
      {aiAction?.type === "mcq" && (
        <AiMcqModal item={aiAction.item} onClose={() => setAiAction(null)} />
      )}
    </div>
  );
};

export default TeacherProfile;
