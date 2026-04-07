"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { FaSun, FaMoon, FaDesktop, FaCheck } from "react-icons/fa";

const themeOptions = [
  { value: "light", label: "Sáng", icon: FaSun, color: "#f59e0b" },
  { value: "dark", label: "Tối", icon: FaMoon, color: "#6366f1" },
  { value: "system", label: "Hệ thống", icon: FaDesktop, color: "#00c853" },
];

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Tránh hydration mismatch
  useEffect(() => setMounted(true), []);

  // Click outside để đóng dropdown
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!mounted) {
    // Placeholder tránh layout shift
    return (
      <div className="w-10 h-10 rounded-full bg-card-border/30 animate-pulse" />
    );
  }

  // Icon hiện tại dựa trên resolvedTheme (theme thực tế đang hiển thị)
  const ActiveIcon = resolvedTheme === "dark" ? FaMoon : FaSun;
  const activeColor = resolvedTheme === "dark" ? "#6366f1" : "#f59e0b";

  return (
    <div className="relative" ref={ref}>
      {/* Nút chính */}
      <button
        id="theme-toggle-btn"
        onClick={() => setOpen(!open)}
        aria-label="Chuyển đổi giao diện"
        className="relative w-10 h-10 flex items-center justify-center rounded-full
          bg-card-bg border border-card-border
          hover:border-[#00c853]/50 hover:shadow-md
          active:scale-90 transition-all duration-200 group"
      >
        <ActiveIcon
          className="w-[18px] h-[18px] transition-transform duration-300 group-hover:rotate-12"
          style={{ color: activeColor }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-44
            bg-card-bg border border-card-border rounded-xl
            shadow-2xl z-50 overflow-hidden
            animate-in slide-in-from-top-2 duration-200"
        >
          {themeOptions.map((opt) => {
            const isActive = theme === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                id={`theme-option-${opt.value}`}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
                  transition-colors duration-150
                  ${
                    isActive
                      ? "bg-[#00c853]/10 text-[#00c853]"
                      : "text-text-main hover:bg-background"
                  }`}
              >
                <Icon
                  className="w-4 h-4 shrink-0"
                  style={{ color: isActive ? "#00c853" : opt.color }}
                />
                <span className="flex-1 text-left">{opt.label}</span>
                {isActive && (
                  <FaCheck className="w-3.5 h-3.5 text-[#00c853] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
