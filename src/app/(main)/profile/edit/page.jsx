"use client";
import React, { useState, useEffect, useRef } from "react";
import EditSidebar from "@/components/features/edit-profile/EditSidebar";
import PersonalInfoForm from "@/components/features/edit-profile/PersonalInfoForm";
import SectionHeader from "@/components/features/edit-profile/SectionHeader";
import SkillChipList from "@/components/features/edit-profile/SkillChipList";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import VNeIDVerification from "@/components/features/edit-profile/VNeIDVerification";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import toast from "react-hot-toast";

const EditProfilePage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { updateProfile, isUpdating, profile, isLoading: profileLoading } = useCandidateProfile();

  // Ref để lấy dữ liệu từ PersonalInfoForm
  const personalFormRef = useRef();

  // State cho phần skills (quản lý ở page)
  const [skills, setSkills] = useState([]);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");

  // Mock data cho Kinh nghiệm và Học vấn (sẽ thay thế bằng API sau)
  const [experiences] = useState([
    {
      id: 1,
      role: "Senior Developer",
      company: "WebCreatives",
      type: "Toàn thời gian",
    },
  ]);

  const [education] = useState([
    {
      id: 1,
      school: "FPT Polytechnic",
      major: "Software Development",
      time: "2023 - 2025",
    },
  ]);

  // Khi profile được fetch, đồng bộ skills từ API vào state
  useEffect(() => {
    if (profile && profile.skills) {
      setSkills(profile.skills);
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Handlers cho skills
  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setNewSkillInput("");
    setIsAddingSkill(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleCancelAdd = () => {
    setNewSkillInput("");
    setIsAddingSkill(false);
  };

  // Submit toàn bộ: personal info + skills
  const handleSubmitAll = async () => {
    // Lấy dữ liệu từ PersonalInfoForm thông qua ref
    const personalData = personalFormRef.current?.getPersonalData();
    if (!personalData) {
      toast.error("Không thể lấy dữ liệu cá nhân");
      return;
    }

    const payload = {
      ...personalData,
      skills: skills,
    };

    const result = await updateProfile(payload);
    if (result.success) {
      toast.success("Cập nhật hồ sơ thành công!");
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c853]"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background pt-10 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 bg-card-bg p-4 rounded-3xl shadow-sm border border-card-border">
              <EditSidebar />
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3 space-y-8">
            {/* VNeID */}
            <div className="scroll-mt-24">
              <VNeIDVerification />
            </div>

            {/* Personal Info */}
            <div id="personal" className="scroll-mt-24">
              <PersonalInfoForm ref={personalFormRef} />
            </div>

            {/* Kinh nghiệm làm việc */}
            <section
              id="exp"
              className="scroll-mt-24 bg-card-bg p-8 rounded-3xl shadow-sm border border-card-border"
            >
              <SectionHeader title="Kinh nghiệm làm việc" onAdd={() => {}} />
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 bg-background rounded-2xl flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-card-bg rounded-xl flex items-center justify-center text-[#00c853] shadow-sm">
                        <FaPlus />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main">{exp.role}</h4>
                        <p className="text-xs text-gray-400">
                          {exp.company} • {exp.type}
                        </p>
                      </div>
                    </div>
                    <button className="text-[#00c853] text-sm font-bold opacity-0 group-hover:opacity-100 transition-all hover:underline">
                      Chỉnh sửa
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Học vấn */}
            <section
              id="edu"
              className="scroll-mt-24 bg-card-bg p-8 rounded-3xl shadow-sm border border-card-border"
            >
              <SectionHeader title="Học vấn" onAdd={() => {}} />
              {education.length > 0 ? (
                education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-5 bg-background rounded-2xl flex items-center gap-4 mb-3"
                  >
                    <div className="w-10 h-10 bg-[#00c853]/10 text-[#00c853] rounded-lg flex items-center justify-center font-bold">
                      F
                    </div>
                    <div>
                      <h4 className="font-bold text-text-main text-sm">
                        {edu.school}
                      </h4>
                      <p className="text-xs text-gray-400">{edu.major}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 bg-background rounded-2xl border border-dashed border-card-border text-center">
                  <p className="text-sm text-gray-400 italic uppercase tracking-tighter">
                    Chưa có thông tin học vấn
                  </p>
                </div>
              )}
            </section>

            {/* Skills Section */}
            <section
              id="skill"
              className="scroll-mt-24 bg-card-bg p-8 rounded-3xl shadow-sm border border-card-border"
            >
              <SectionHeader
                title="Kỹ năng chuyên môn"
                onAdd={!isAddingSkill ? () => setIsAddingSkill(true) : undefined}
              />
              <SkillChipList skills={skills} onRemove={handleRemoveSkill} />

              {isAddingSkill && (
                <div className="mt-4 flex items-center gap-3">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                      if (e.key === "Escape") {
                        handleCancelAdd();
                      }
                    }}
                    placeholder="Nhập tên kỹ năng (VD: React, Node.js...)"
                    className="flex-1 p-3.5 rounded-2xl border border-card-border bg-background focus:ring-2 focus:ring-[#00c853] outline-none font-medium"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-5 py-3.5 bg-[#00c853] text-white font-black rounded-xl hover:bg-[#00a846] transition-all shadow-md active:scale-95"
                  >
                    Thêm
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelAdd}
                    className="px-5 py-3.5 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </section>

            {/* Nút Submit toàn bộ */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmitAll}
                disabled={isUpdating}
                className="px-8 py-3.5 bg-[#00c853] text-white font-black rounded-xl hover:bg-[#00a846] transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Đang lưu..." : "Lưu tất cả thay đổi"}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;