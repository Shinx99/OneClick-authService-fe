"use client";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button disabled={page === 0} onClick={() => onPageChange(page - 1)} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30">
        <FaChevronLeft size={14} />
      </button>
      {[...Array(totalPages).keys()].map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-lg text-sm font-bold ${p === page ? "bg-[#00c853] text-white" : "hover:bg-gray-100 text-gray-500"}`}
        >
          {p + 1}
        </button>
      ))}
      <button disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30">
        <FaChevronRight size={14} />
      </button>
    </div>
  );
}