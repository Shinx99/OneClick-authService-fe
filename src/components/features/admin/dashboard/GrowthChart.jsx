'use client';

import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/admindashboard.service.js';
import SingleLineChart from './SingleLineChart';

export default function GrowthChart({ months = 6 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await dashboardService.getGrowthData(months);
        console.log('Growth data from API:', result.growthData);
        console.log('First item keys:', Object.keys(result.growthData[0]));
        setData(result.growthData);
      } catch (err) {
        console.error('Lỗi tải dữ liệu tăng trưởng:', err);
        setError('Không thể tải dữ liệu biểu đồ.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [months]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border h-64 animate-pulse">
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-40 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-2xl border shadow-sm text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">
        Xu hướng tăng trưởng ({months} tháng gần nhất)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SingleLineChart
          data={data}
          dataKey="candidates"
          title="Ứng viên"
          color="#10b981"
        />
        <SingleLineChart
          data={data}
          dataKey="companies"
          title="Công ty"
          color="#3b82f6"
        />
        <SingleLineChart
          data={data}
          dataKey="employers"
          title="Nhà tuyển dụng"
          color="#6366f1"
        />
        <SingleLineChart
          data={data}
          dataKey="jobs"
          title="Tin tuyển dụng"
          color="#8b5cf6"
        />
      </div>
    </div>
  );
}