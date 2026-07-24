import { useNavigate } from "react-router-dom";

const RESOURCE_TYPES = [
  { key: "notes", label: "Notes", icon: "📒" },
  { key: "books", label: "Books", icon: "📚" },
  { key: "videos", label: "Videos", icon: "🎥" },
  { key: "links", label: "Links", icon: "🔗" },
];

const TeacherDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen text-white px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Teacher Dashboard</h1>
        <p className="text-gray-400 mt-2">Manage your resources</p>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {RESOURCE_TYPES.map((type) => (
          <button key={type.key} onClick={() => navigate(`/resources/${type.key}`)} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center transition hover:scale-[1.03] hover:border-indigo-400/40">
            <div className="text-4xl mb-3">{type.icon}</div>
            <h2 className="text-xl font-semibold group-hover:text-indigo-300">{type.label}</h2>
            <p className="mt-2 text-sm text-gray-400">Add and manage {type.label.toLowerCase()}</p>
          </button>
        ))}
      </section>
    </div>
  );
};

export default TeacherDashboard;
