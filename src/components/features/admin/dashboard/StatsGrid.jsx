import {
  FaUserFriends,
  FaBuilding,
  FaWallet,
  FaBullhorn,
} from "react-icons/fa";

const icons = {
  green: <FaUserFriends className="text-green-500" />,
  blue: <FaBuilding className="text-blue-500" />,
  orange: <FaWallet className="text-orange-500" />,
  purple: <FaBullhorn className="text-purple-500" />,
};

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div
          key={item.id}
          className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 group-hover:scale-110 transition-transform`}
            >
              {icons[item.color]}
            </div>
            <span
              className={`text-[10px] font-black px-2 py-1 rounded-lg bg-green-50 text-green-600`}
            >
              {item.trend}
            </span>
          </div>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">
            {item.label}
          </p>
          <p className="text-2xl font-black text-gray-800 mt-1">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
