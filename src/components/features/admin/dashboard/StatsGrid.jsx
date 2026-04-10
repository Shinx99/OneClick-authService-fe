import {
  FaUserFriends,
  FaBuilding,
  FaUserTie, 
  FaBullhorn,
} from "react-icons/fa";

const cardStyles = {
  candidates: {
    icon: <FaUserFriends size={28} className="text-green-600" />,
    bgColor: "from-green-50",
    border: "border-green-100",
    iconBg: "bg-green-100",
  },
  companies: {
    icon: <FaBuilding size={28} className="text-blue-600" />,
    bgColor: "from-blue-50",
    border: "border-blue-100",
    iconBg: "bg-blue-100",
  },
  employers: {
    icon: <FaUserTie size={28} className="text-indigo-600" />,
    bgColor: "from-indigo-50",
    border: "border-indigo-100",
    iconBg: "bg-indigo-100",
  },
  jobs: {
    icon: <FaBullhorn size={28} className="text-purple-600" />,
    bgColor: "from-purple-50",
    border: "border-purple-100",
    iconBg: "bg-purple-100",
  },
};

export default function StatsGrid({ counts }) {
  const items = [
    { label: "Tổng ứng viên", value: counts.totalCandidates, type: "candidates" },
    { label: "Tổng công ty", value: counts.totalCompanies, type: "companies" },
    { label: "Nhà tuyển dụng", value: counts.totalEmployers, type: "employers" },
    { label: "Tin tuyển dụng", value: counts.totalJobs, type: "jobs" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => {
        const style = cardStyles[item.type];
        return (
          <div
            key={item.type}
            className={`relative overflow-hidden rounded-2xl border ${style.border} bg-gradient-to-br ${style.bgColor} to-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/30" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  {item.label}
                </span>
                <div className={`rounded-xl ${style.iconBg} p-2`}>
                  {style.icon}
                </div>
              </div>
              <p className="text-4xl font-extrabold text-gray-800 tracking-tight">
                {item.value.toLocaleString()}
              </p>
              <div className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-current to-transparent opacity-30" />
            </div>
          </div>
        );
      })}
    </div>
  );
}