"use client";
import React from "react";
import { MdAdd, MdOutlineLaptopMac, MdOutlineLocalHospital, MdOutlineFastfood } from "react-icons/md";

const benefits = [
  { icon: MdOutlineLaptopMac, label: "Provided Equipment", desc: "Latest MacBooks & Gear", color: "bg-emerald-50 text-emerald-600" },
  { icon: MdOutlineLocalHospital, label: "Premium Healthcare", desc: "100% covered plans", color: "bg-blue-50 text-blue-600" },
  { icon: MdOutlineFastfood, label: "Free Snacks", desc: "Fully stocked pantry", color: "bg-amber-50 text-amber-600" },
];

const BenefitsPerks = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-800">Benefits & Perks</h3>
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all">
          <MdAdd className="w-4 h-4" /> Add Benefit
        </button>
      </div>
      <div className="flex gap-3">
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.label} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl ${b.color} bg-opacity-50`}>
              <Icon className="w-8 h-8" />
              <p className="text-sm font-semibold text-slate-700">{b.label}</p>
              <p className="text-xs text-slate-400">{b.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BenefitsPerks;
