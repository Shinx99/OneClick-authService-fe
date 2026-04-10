'use client';
import { useState, useEffect } from 'react';
import StatsGrid from '@/components/features/admin/dashboard/StatsGrid';
import GrowthChart from '@/components/features/admin/dashboard/GrowthChart';
import RecentActivities from '@/components/features/admin/dashboard/RecentActivities';
import MonthPicker from '@/components/features/admin/dashboard/MonthPicker';
import { dashboardService } from '@/services/admindashboard.service.js';
import Skeleton from '@/components/features/admin/dashboard/Skeleton';

export default function AdminDashboard() {
  const [counts, setCounts] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardService.getAdminCounts(selectedMonth || null);
        setCounts(data);
      } catch (err) {
        setError('Không thể tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth]);

  return (
    <div className="space-y-8">
      {/* Header và MonthPicker */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Bảng điều khiển</h1>
          <p className="text-sm text-gray-400">Chào mừng trở lại, quản trị viên!</p>
        </div>
        <MonthPicker selectedMonth={selectedMonth} onChange={setSelectedMonth} />
      </div>

      {/* Loading / Error / StatsGrid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {!loading && !error && counts && <StatsGrid counts={counts} />}

      {/* Biểu đồ và Hoạt động gần đây */}
      {!loading && !error && (
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8">
            <GrowthChart month={selectedMonth} />
          </div>
          <div className="col-span-4">
            <RecentActivities />
          </div>
        </div>
      )}
    </div>
  );
}