export default function RecentActivities({ activities }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-full">
      <h3 className="text-lg font-black text-gray-800 mb-6">
        Hoạt động gần đây
      </h3>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-gray-50">
        {activities.map((act) => (
          <div key={act.id} className="relative flex gap-4 items-start">
            <div className="relative z-10 w-10 h-10 rounded-xl bg-white border-4 border-gray-50 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-[#00c853]"></div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{act.title}</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {act.desc}
              </p>
              <p className="text-[10px] font-bold text-gray-300 uppercase mt-2">
                {act.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-10 py-4 bg-green-50 text-[#00c853] rounded-2xl font-bold text-sm hover:bg-[#00c853] hover:text-white transition-all">
        Xem tất cả hoạt động
      </button>
    </div>
  );
}
