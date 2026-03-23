// const ResourceCard = ({ item }) => {
//   return (
//     <div className="
//       p-5 rounded-2xl
//       bg-white/5 border border-white/10
//       hover:scale-[1.03]
//       transition duration-300
//     ">

//       <h3 className="text-lg font-semibold">
//         {item.title}
//       </h3>

//       <p className="text-sm text-gray-400 mt-2 line-clamp-3">
//         {item.description}
//       </p>

//       <a
//         href={item.link}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="
//           mt-4 inline-block px-4 py-2
//           bg-indigo-500 hover:bg-indigo-600
//           rounded-lg text-sm font-medium
//           transition
//         "
//       >
//         Open →
//       </a>
//     </div>
//   );
// };

// export default ResourceCard;
// import { useNavigate } from "react-router-dom";

// const ResourceCard = ({ item, teacher }) => {
//   const navigate = useNavigate();

//   return (
    
//     <div
//       className="
//         p-5 rounded-2xl
//         bg-white/5 border border-white/10
//         hover:scale-[1.03]
//         hover:shadow-xl
//         transition duration-300
//       "
//     >
      

//       {/* 🔥 TITLE */}
//       <h3 className="text-lg font-semibold">
//         {item.title}
//       </h3>

//       {/* 🔥 DESCRIPTION */}
//       <p className="text-sm text-gray-400 mt-2 line-clamp-3">
//         {item.description}
//       </p>

//       {/* 🔥 TEACHER INFO */}
//       {teacher && (
//         <div
//           onClick={() => navigate(`/teacher/${teacher.userId}`)}
//           className="
//             mt-3 flex items-center gap-2
//             cursor-pointer
//             hover:text-indigo-400
//             transition
//           "
//         >
//           {/* Avatar */}
//           {/* <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
//             {teacher.name?.charAt(0)}
//           </div> */}
//           <span className="
//   px-2 py-1 text-xs
//   bg-indigo-500/20 text-indigo-400
//   rounded-md
// ">
//   Teacher
// </span>

//           {/* Name */}
//           <span className="text-sm text-gray-300">
//             {teacher.name}
//           </span>
//         </div>
//       )}
      

//       {/* 🔥 BUTTON */}
//       <a
//         href={item.link}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="
//           mt-4 inline-block px-4 py-2
//           bg-indigo-500 hover:bg-indigo-600
//           rounded-lg text-sm font-medium
//           transition
//         "
//       >
//         Open →
//       </a>
//     </div>
//   );
// };

// export default ResourceCard;

import { useNavigate } from "react-router-dom";

const ResourceCard = ({ item, teacher }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        relative group
        p-5 rounded-2xl
        bg-white/5 border border-white/10
        transition duration-300
        hover:scale-[1.03]
        hover:shadow-xl

        /* 🔥 TIGHT GLOW */
        shadow-[0_0_0px_rgba(99,102,241,0)]
        group-hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]
      "
    >

      {/* OPTIONAL INNER GLOW (VERY PREMIUM LOOK) */}
      <div
        className="
          absolute inset-0 rounded-2xl
          opacity-0 group-hover:opacity-100
          transition duration-300
          pointer-events-none
          bg-gradient-to-br from-indigo-500/10 to-purple-500/10
        "
      ></div>

      {/* CONTENT */}
      <div className="relative z-10">

        {/* TITLE */}
        <h3 className="text-lg font-semibold">
          {item.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-400 mt-2 line-clamp-3">
          {item.description}
        </p>

        {/* TEACHER */}
        {teacher && (
          <div
            onClick={() => navigate(`/teacher/${teacher.userId}`)}
            className="
              mt-3 flex items-center gap-2
              cursor-pointer
              hover:text-indigo-400
              transition
            "
          >
            <span className="
              px-2 py-1 text-xs
              bg-indigo-500/20 text-indigo-400
              rounded-md
            ">
              Teacher
            </span>

            <span className="text-sm text-gray-300">
              {teacher.name}
            </span>
          </div>
        )}

        {/* BUTTON */}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-4 inline-block px-4 py-2
            bg-indigo-500 hover:bg-indigo-600
            rounded-lg text-sm font-medium
            transition
          "
        >
          Open →
        </a>

      </div>
    </div>
  );
};

export default ResourceCard;