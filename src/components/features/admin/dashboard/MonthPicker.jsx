'use client';
export default function MonthPicker({ selectedMonth, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-600">Tháng:</label>
      <input
        type="month"
        value={selectedMonth}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}