

// import { useEffect, useState } from "react";
// import { databases, storage } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { Container } from "../components";
// import { Link, useNavigate } from "react-router-dom";

// function Home() {
//   const [teachers, setTeachers] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         const res = await databases.listDocuments(
//           conf.appwriteDatabaseId,
//           conf.appwriteCollectionId
//         );
//         setTeachers(res.documents.slice(0, 6));
//       } catch (error) {
//         console.log("Fetch error:", error);
//       }
//     };

//     fetchTeachers();
//   }, []);

//   return (
//     <div className="w-full min-h-screen  text-white">

//       {/* 🔥 HERO */}
//       <section className="w-full py-24 text-center relative overflow-hidden">
        
//         {/* background glow */}
//         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/2 via-purple-500/1 to-transparent blur-3xl"></div>

//         <Container>
//           <h1 className="text-4xl md:text-5xl font-bold leading-tight">
//             Learn Smarter.
//             <br />
//             <span className="text-indigo-400">Grow Faster 🚀</span>
//           </h1>

//           <p className="mt-5 text-gray-300 max-w-xl mx-auto">
//             A centralized hub for UIET students to access curated notes,
//             books, videos, and important academic resources.
//           </p>

//           <div className="mt-8 flex justify-center gap-4">
            
            
//              {[
                
//                 { name: "Teachers", path: "/teachers" },
//                 // { name: "Dashboard", path: "/dashboard" },
//               ].map((item) => (
//                 <span key={item.name}>
//                   <Link
//                     to={item.path}
//                     className="
//                       relative px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold transition
//                     "
//                   >
//                     {item.name}

//                     {/* underline animation */}
//                     <span className="
//                       absolute left-0 -bottom-1 w-0 h-[2px]
//                       bg-indigo-400
//                       transition-all duration-300
//                       group-hover:w-full
//                     "></span>
//                   </Link>
//                 </span>
//               ))}
//           </div>
//         </Container>
//       </section>

//       {/* 🔥 CATEGORIES */}
//       <section className="py-16">
//         <Container>
//           <h2 className="text-2xl font-semibold mb-8 text-center">
//             Browse Resources
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {[
//               { name: "Notes", type: "notes", icon: "📒" },
//               { name: "Books", type: "books", icon: "📚" },
//               { name: "Videos", type: "videos", icon: "🎥" },
//               { name: "Links", type: "links", icon: "🔗" },
//             ].map((item) => (
//               <div
//                 key={item.type}
//                 onClick={() => navigate(`/explore/${item.type}`)}
//                 className="cursor-pointer p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:scale-105 transition"
//               >
//                 <div className="text-3xl">{item.icon}</div>
//                 <h3 className="mt-3 font-medium">{item.name}</h3>
//               </div>
//             ))}
//           </div>
//         </Container>
//       </section>

//       {/* 🔥 TEACHERS */}
//       <section className="py-16">
//         <Container>
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-2xl font-semibold">Top Contributors</h2>

//             <Link
//               to="/teachers"
//               className="text-indigo-400 hover:underline"
//             >
//               View all →
//             </Link>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6">
//             {teachers.map((t) => {
//               const imageUrl = t.imageId
//                 ? storage
//                     .getFileView(conf.appwriteBucketId, t.imageId)
//                     .toString()
//                 : "https://via.placeholder.com/300";

//               return (
//                 <div
//                   key={t.$id}
//                   onClick={() => navigate(`/teacher/${t.userId}`)}
//                   className="cursor-pointer rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:scale-[1.03] transition"
//                 >
//                   <img
//                     src={imageUrl}
//                     alt="teacher"
//                     className="w-full h-40 object-cover"
//                   />

//                   <div className="p-4">
//                     <h3 className="font-semibold">{t.name}</h3>
//                     <p className="text-sm text-gray-400">
//                       {t.designation}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </Container>
//       </section>
//     </div>
//   );
// }

// export default Home;


import { useEffect, useState } from "react";
import { databases, storage } from "../lib/appwrite";
import conf from "../conf/conf";
import { Container } from "../components";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  const CACHE_KEY = "home-teachers";
  const CACHE_TIME = 10 * 60 * 1000; // 10 min

  const fetchTeachers = async () => {
    try {
      const res = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId
      );

      const topTeachers = res.documents.slice(0, 6);

      setTeachers(topTeachers);

      // ✅ cache save
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: topTeachers,
          timestamp: Date.now(),
        })
      );

    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY));

    // ✅ use cache (no API call)
    if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
      setTeachers(cache.data);
      return;
    }

    fetchTeachers();
  }, []);

  return (
    <div className="w-full min-h-screen text-white">

      {/* 🔥 HERO */}
      <section className="w-full py-24 text-center relative overflow-hidden">
        
        {/* background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/2 via-purple-500/1 to-transparent blur-3xl"></div>

        <Container>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Learn Smarter.
            <br />
            <span className="text-indigo-400">Grow Faster 🚀</span>
          </h1>

          <p className="mt-5 text-gray-300 max-w-xl mx-auto">
            A centralized hub for UIET students to access curated notes,
            books, videos, and important academic resources.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            {[
              { name: "Teachers", path: "/teachers" },
            ].map((item) => (
              <span key={item.name}>
                <Link
                  to={item.path}
                  className="
                    relative px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold transition
                  "
                >
                  {item.name}

                  <span className="
                    absolute left-0 -bottom-1 w-0 h-[2px]
                    bg-indigo-400
                    transition-all duration-300
                    group-hover:w-full
                  "></span>
                </Link>
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* 🔥 CATEGORIES */}
      <section className="py-16">
        <Container>
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Browse Resources
          </h2>

          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {[
              { name: "Notes", type: "notes", icon: "📒" },
              { name: "Books", type: "books", icon: "📚" },
              { name: "Videos", type: "videos", icon: "🎥" },
              { name: "Links", type: "links", icon: "🔗" },
            ].map((item) => (
              <div
                key={item.type}
                onClick={() => navigate(`/explore/${item.type}`)}
                className="cursor-pointer p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:scale-105 transition"
              >
                
                <div className="text-3xl">{item.icon}</div>
                
                <h3 className="mt-3 font-medium">{item.name}</h3>
              </div>
            ))}
          </div> */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {[
    { name: "Notes", type: "notes", icon: "📒" },
    { name: "Books", type: "books", icon: "📚" },
    { name: "Videos", type: "videos", icon: "🎥" },
    { name: "Links", type: "links", icon: "🔗" },
  ].map((item) => (
    <div
      key={item.type}
      onClick={() => navigate(`/explore/${item.type}`)}
      className="
        relative group cursor-pointer
        p-6 rounded-2xl
        bg-white/5 backdrop-blur
        border border-white/10
        hover:scale-105 transition
        overflow-hidden
      "
    >
      
      {/* 🔥 Glow Effect */}
      <div className="
        absolute inset-0
        bg-gradient-to-br from-indigo-500/20 to-purple-500/10
        opacity-0 group-hover:opacity-100
        transition duration-300
        blur-xl
      "></div>

      {/* CONTENT */}
      <div className="relative z-10">
        <div className="text-3xl">{item.icon}</div>
        <h3 className="mt-3 font-medium">{item.name}</h3>
      </div>

    </div>
  ))}
</div>
        </Container>
      </section>
               
          <div className="text-center mb-12">

  <h2 className="text-3xl font-semibold mb-6">
    Teachers
  </h2>

  <p className="text-gray-400 text-sm mb-6">
    Learn from your Teachers and explore their resources
  </p>

  <Link
    to="/teachers"
    className="
      inline-block px-6 py-2 rounded-full
      bg-indigo-500/10 text-indigo-400
      border border-indigo-500/20

      transition-all duration-300
      hover:bg-indigo-500 hover:text-white
      hover:-translate-y-[1px]
      hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]
    "
  >
    View All Teachers →
  </Link>

</div>

      {/* 🔥 TEACHERS */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-16 gap-x-10 text-center">

  {teachers.slice(0, 5).map((t, index) => {
    const imageUrl = t.imageId
      ? storage
          .getFileView(conf.appwriteBucketId, t.imageId)
          .toString()
      : "https://via.placeholder.com/300";

    // 🎨 colors (matching style)
    const colors = [
     "bg-purple-400/20",
     "bg-purple-400/20",
     "bg-purple-400/20",
     "bg-purple-400/20",
     "bg-purple-400/20",
     
    ];

    return (
      <div
        key={t.$id}
        onClick={() => navigate(`/teacher/${t.userId}`)}
        className="group cursor-pointer flex flex-col items-center"
      >

        {/* 🔥 SHAPE WRAPPER */}
        <div className="relative w-28 h-28">

          {/* 🔥 HALF SHAPE (LEFT SIDE CURVE) */}
          <div
            className={`
              absolute inset-0 ${colors[index % colors.length]}
              rounded-full
              clip-path-[polygon(0_0,60%_0,60%_100%,0_100%)]
              transform -translate-x-2 -rotate-12
              transition duration-300
              group-hover:rotate-0 group-hover:-translate-x-1
            `}
          ></div>

          {/* 🔥 IMAGE */}
          <img
            src={imageUrl}
            alt={t.name}
            className="
              relative w-28 h-28 rounded-full object-cover
              border-4 border-white
              shadow-lg
              transition duration-300
              group-hover:scale-105
            "
          />
        </div>

        {/* 🔥 NAME */}
        <h3 className="mt-4 font-semibold">
          {t.name}
        </h3>

        {/* 🔥 ROLE */}
        <p className="text-sm text-gray-400">
          {t.designation}
        </p>

      </div>
    );
  })}

</div>
    </div>
  );
}

export default Home;