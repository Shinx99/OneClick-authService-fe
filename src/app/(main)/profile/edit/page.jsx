"use client";
import React, { useState, useEffect, useRef } from "react";
import EditSidebar from "@/components/features/edit-profile/EditSidebar";
import PersonalInfoForm from "@/components/features/edit-profile/PersonalInfoForm";
import SectionHeader from "@/components/features/edit-profile/SectionHeader";
import SkillChipList from "@/components/features/edit-profile/SkillChipList";
import SkillAutocompleteInput from "@/components/features/edit-profile/SkillAutocompleteInput";
import EducationFormModal from "@/components/features/edit-profile/EducationFormModal";
import ExperienceFormModal from "@/components/features/edit-profile/ExperienceFormModal";
import candidateService from "@/services/candidate.service";
import educationService from "@/services/education.service";
import { FaPlus, FaGraduationCap, FaEdit, FaTrash  } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import VNeIDVerification from "@/components/features/edit-profile/VNeIDVerification";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

const EditProfilePage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { updateProfile, isUpdating, profile, isLoading: profileLoading } = useCandidateProfile();
  const [allSkills, setAllSkills] = useState([]);
  const [educations, setEducations] = useState([]);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [isSubmittingEducation, setIsSubmittingEducation] = useState(false);

  // Ref để lấy dữ liệu từ PersonalInfoForm
  const personalFormRef = useRef();

  // State cho phần skills (quản lý ở page)
  const [skills, setSkills] = useState([]);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");

  const [experiences, setExperiences] = useState([]);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [isSubmittingExperience, setIsSubmittingExperience] = useState(false);

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

  useEffect(() => {
    const loadAllSkills = async () => {
      try {
        const skills = await candidateService.getAllSkills();
        setAllSkills(skills);
      } catch (error) {
        console.error("Lỗi tải danh sách kỹ năng:", error);
      }
    };
    loadAllSkills();
  }, []);;

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const data = await educationService.getAll();
        setEducations(data || []);
      } catch (error) {
        console.error("Lỗi tải học vấn:", error);
        toast.error("Không thể tải dữ liệu học vấn");
      }
    };
    if (isAuthenticated) {
      fetchEducations();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (profile?.experiences) {
      setExperiences(profile.experiences);
    }
  }, [profile]);

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

  // Handlers cho education
  // Mở modal thêm mới
  const handleAddEducation = () => {
    setEditingEducation(null);
    setIsEducationModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleEditEducation = (edu) => {
    setEditingEducation(edu);
    setIsEducationModalOpen(true);
  };

  // Xóa học vấn
  const handleDeleteEducation = async (educationId) => {
    if (!confirm("Bạn có chắc muốn xóa thông tin học vấn này?")) return;
    try {
      await educationService.delete(educationId);
      setEducations(prev => prev.filter(e => e.educationId !== educationId));
      toast.success("Đã xóa học vấn");
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  // Submit form (thêm hoặc cập nhật)
  const handleEducationSubmit = async (formData) => {
    setIsSubmittingEducation(true);
    try {
      let saved;
      if (editingEducation) {
        saved = await educationService.update(editingEducation.educationId, formData);
        setEducations(prev => prev.map(e => e.educationId === saved.educationId ? saved : e));
        toast.success("Cập nhật học vấn thành công");
      } else {
        saved = await educationService.create(formData);
        setEducations(prev => [saved, ...prev]);
        toast.success("Thêm học vấn thành công");
      }
      setIsEducationModalOpen(false);
    } catch (error) {
      toast.error(editingEducation ? "Cập nhật thất bại" : "Thêm mới thất bại");
    } finally {
      setIsSubmittingEducation(false);
    }
  };

  // Handlers cho Kinh nghiệm làm việc
  const handleAddExperience = () => {
    setEditingExperience(null);
    setIsExperienceModalOpen(true);
  };

  const handleEditExperience = (exp) => {
    setEditingExperience(exp);
    setIsExperienceModalOpen(true);
  };

  const handleDeleteExperience = (expId) => {
    setExperiences(prev => prev.filter(e => e.experienceId !== expId));
  };

  const handleExperienceSubmit = (formData) => {
    if (editingExperience) {
      setExperiences(prev =>
        prev.map(e => e.experienceId === editingExperience.experienceId
          ? { ...e, ...formData }
          : e)
      );
    } else {
      const newExp = {
        experienceId: uuidv4(),
        ...formData,
        companyId: null, // đảm bảo null
      };
      setExperiences(prev => [newExp, ...prev]);
    }
    setIsExperienceModalOpen(false);
  };

  // Submit toàn bộ: personal info + skills
  const handleSubmitAll = async () => {
    // Lấy dữ liệu từ PersonalInfoForm thông qua ref
    const personalData = personalFormRef.current?.getPersonalData();
    const educationsPayload = educations.map(({ educationId, ...rest }) => rest);
    const experiencesPayload = experiences.map(({ experienceId, ...rest }) => rest);
    if (!personalData) {
      toast.error("Không thể lấy dữ liệu cá nhân");
      return;
    }

    const payload = {
      ...personalData,
      skills: skills,
      educations: educationsPayload,
      experiences: experiencesPayload,
    };

    const result = await updateProfile(payload);
    if (result.success) {
      toast.success("Cập nhật hồ sơ thành công!");
      router.push("/profile");
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
              <SectionHeader
                title="Kinh nghiệm làm việc"
                onAdd={handleAddExperience}
              />
              <div className="space-y-4">
                {experiences.length > 0 ? (
                  experiences.map((exp) => (
                    <div
                      key={exp.experienceId}
                      className="p-5 bg-background rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-text-main text-lg">
                          {exp.headline}
                        </h4>
                        <p className="text-[#00c853] font-medium text-sm mt-1">
                          {exp.companyName || exp.customCompanyName}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          {exp.startDate && (
                            <>
                              {new Date(exp.startDate).toLocaleDateString("vi-VN", {
                                month: "numeric",
                                year: "numeric",
                              })}
                            </>
                          )}
                          {exp.startDate && (exp.endDate || exp.isCurrent) && " — "}
                          {exp.isCurrent
                            ? "Hiện tại"
                            : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString("vi-VN", {
                                month: "numeric",
                                year: "numeric",
                              })
                            : ""}
                          {exp.employmentType && ` • ${exp.employmentType}`}
                          {exp.employmentLocation && ` • ${exp.employmentLocation}`}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-text-muted mt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleEditExperience(exp)}
                          className="p-2 text-gray-400 hover:text-[#00c853] transition-colors rounded-full hover:bg-green-50"
                          title="Chỉnh sửa"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(exp.experienceId)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                          title="Xóa"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 bg-background rounded-2xl border border-dashed border-card-border text-center">
                    <p className="text-sm text-gray-400 italic">
                      Chưa có kinh nghiệm làm việc. Nhấn "Thêm mới" để bổ sung.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Học vấn */}
            <section
              id="edu"
              className="scroll-mt-24 bg-card-bg p-8 rounded-3xl shadow-sm border border-card-border"
            >
              <SectionHeader
                title="Học vấn"
                onAdd={handleAddEducation}
              />

              <div className="space-y-4">
                {educations.length > 0 ? (
                  educations.map((edu) => (
                    <div
                      key={edu.educationId}
                      className="p-5 bg-background rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#00c853]/10 text-[#00c853] rounded-xl flex items-center justify-center flex-shrink-0">
                          <FaGraduationCap size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-text-main text-lg">
                            {edu.schoolName}
                          </h4>
                          <p className="text-sm text-text-muted">
                            {edu.degree && `${edu.degree} • `}{edu.fieldOfStudy}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {edu.startDate && `${edu.startDate} — `}
                            {edu.isCurrent ? "Đang theo học" : edu.endDate || "Chưa có năm tốt nghiệp"}
                          </p>
                          {edu.description && (
                            <p className="text-sm text-text-muted mt-2 line-clamp-2">{edu.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleEditEducation(edu)}
                          className="p-2 text-gray-400 hover:text-[#00c853] transition-colors rounded-full hover:bg-green-50"
                          title="Chỉnh sửa"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEducation(edu.educationId)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                          title="Xóa"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 bg-background rounded-2xl border border-dashed border-card-border text-center">
                    <p className="text-sm text-gray-400 italic">
                      Chưa có thông tin học vấn. Nhấn "Thêm mới" để bổ sung.
                    </p>
                  </div>
                )}
              </div>
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
                <div className="mt-4">
                  <SkillAutocompleteInput
                    allSkills={allSkills}
                    existingSkills={skills}
                    onAdd={(skillName) => {
                      setSkills(prev => [...prev, skillName]);
                      setIsAddingSkill(false);
                    }}
                    onCancel={handleCancelAdd}
                  />
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
      {/* Modal Học vấn */}
      <EducationFormModal
        isOpen={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        onSubmit={handleEducationSubmit}
        initialData={editingEducation}
        isSubmitting={isSubmittingEducation}
      />
      {/* Modal Kinh nghiệm */}
      <ExperienceFormModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        onSubmit={handleExperienceSubmit}
        initialData={editingExperience}
        isSubmitting={isSubmittingExperience}
      />
    </div>
  );
};

export default EditProfilePage;