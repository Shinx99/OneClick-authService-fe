import React from "react";
import CompanyTable from "@/components/features/admin/content/CompanyTable";

export default async function ApproveCompaniesPage() {
  const companies = [
    {
      id: "CP-001",
      name: "Công ty TNHH Công nghệ Mới",
      email: "contact@viettech.com",
      taxCode: "0101234567",
      licenseUrl: "#",
      requestDate: "12/10/2023",
      status: "PENDING",
    },
    {
      id: "CP-002",
      name: "Tập đoàn ABC",
      email: "admin@abcgroup.vn",
      taxCode: "0312987654",
      licenseUrl: "#",
      requestDate: "11/10/2023",
      status: "PENDING",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">
          Phê duyệt Công ty
        </h1>
        <span className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-[11px] font-black uppercase">
          {companies.length} yêu cầu mới
        </span>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <CompanyTable data={companies} />
      </div>
    </div>
  );
}
