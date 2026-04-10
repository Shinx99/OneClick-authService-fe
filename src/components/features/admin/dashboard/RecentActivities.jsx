'use client';
import { useEffect, useState } from 'react';
import { FaUser, FaBuilding, FaUserTie, FaBullhorn } from 'react-icons/fa';
import { dashboardService } from '@/services/admindashboard.service';

const iconMap = {
  candidate: <FaUser className="text-green-500" />,
  company: <FaBuilding className="text-blue-500" />,
  employer: <FaUserTie className="text-indigo-500" />,
  job: <FaBullhorn className="text-purple-500" />,
};

function formatTimeAgo(dateString) {
  if (!dateString) return 'vừa xong';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'vừa xong';
  const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);
  if (diffSeconds < 60) return `${diffSeconds} giây trước`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} ngày trước`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} tháng trước`;
}

export default function RecentActivities() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.getRecentActivitiesGrouped()
      .then(setGroups)
      .catch(() => setError('Không thể tải hoạt động'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonLoader />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <h3 className="text-lg font-bold mb-4">Hoạt động gần đây</h3>
      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.type}>
            <div className="flex items-center gap-2 mb-2">
              <span>{iconMap[group.type]}</span>
              <h4 className="text-sm font-semibold text-gray-700">{group.title}</h4>
              <span className="text-xs text-gray-400">({group.items.length})</span>
            </div>
            <ul className="ml-6 space-y-1 border-l border-gray-100 pl-4">
              {group.items.slice(0, 3).map((item) => (
                <li key={item.id} className="text-sm text-gray-600 flex justify-between">
                  <span className="truncate">{item.name}</span>
                  <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                    {formatTimeAgo(item.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// 👇 Định nghĩa SkeletonLoader ở cuối file
function SkeletonLoader() {
  return (
    <div className="bg-white p-6 rounded-2xl border h-full animate-pulse">
      <div className="h-6 w-1/3 bg-gray-200 rounded mb-4" />
      {[1, 2, 3].map(i => (
        <div key={i} className="mb-4">
          <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
          <div className="space-y-2 ml-4">
            <div className="h-3 w-3/4 bg-gray-100 rounded" />
            <div className="h-3 w-2/3 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}