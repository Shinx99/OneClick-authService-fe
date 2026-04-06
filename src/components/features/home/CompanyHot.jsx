"use client";
import React from "react";

const CompanyHot = () => {
  const companies = [
    { id: 1, name: "Mianima 1" },
    { id: 2, name: "Mianima 2" },
    { id: 3, name: "Minimal 3" },
    { id: 4, name: "Mnimal 4" },
    { id: 5, name: "Company 5" },
    { id: 6, name: "Minimal 6" },
  ];

  return (
    <section className="py-10 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-text-main uppercase tracking-tight">
            Công ty hàng đầu
          </h2>
          <div className="w-16 h-1 bg-[#00c853] mx-auto mt-3 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="group p-6 bg-card-bg rounded-2xl shadow-sm border border-card-border hover:border-green-400/50 hover:shadow-md transition-all duration-300 flex items-center justify-center aspect-square"
            >
              <div className="text-center opacity-70 group-hover:opacity-100">
                <span className="text-xs font-bold text-text-muted group-hover:text-green-500 block uppercase tracking-widest leading-tight">
                  {company.name}
                </span>
                <p className="text-[9px] text-gray-300 dark:text-slate-600 font-bold mt-1 uppercase">
                  Logo HRRF
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyHot;
