"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import { CandidateProfileSchema } from "@/lib/validators/candidate";
import toast from "react-hot-toast";

const PersonalInfoForm = () => {

  const { profile, isLoading, isUpdating, updateProfile, refreshProfile } =
    useCandidateProfile();

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   control,
  //   formState: { errors },
  // } = useForm({
  //   resolver: zodResolver(CandidateProfileSchema),
  //   defaultValues: {
  //     candidateId: "",
  //     surname: "",
  //     name: "",
  //     email: "",
  //     phone: "",
  //     about: "",
  //     birthday: "",
  //     gender: undefined,
  //     province: "",
  //     commune: "",
  //     referenceLink: "",
  //   },
  // });

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   control,
  //   getValues,
  //   formState: { errors, dirtyFields },
  // } = useForm({
  //   //resolver: zodResolver(CandidateProfileSchema),
  // });

  const [formData, setFormData] = useState({
    candidateId: "",
    surname: "",
    name: "",
    email: "",
    phone: "",
    about: "",
    birthday: "",
    gender: undefined,
    province: "",
    commune: "",
    referenceLink: "",
  });



  // useEffect(() => {
  //   refreshProfile(); // Load data lần đầu
  // }, [refreshProfile]);


  useEffect(() => {
    if (profile) {
      setFormData({
        candidateId: profile.candidateId ?? "",
        surname: profile.surname ?? "",
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        about: profile.about ?? "",
        birthday: profile.birthday ?? "",
        gender: profile.gender ?? undefined,
        province: profile.province ?? "",
        commune: profile.commune ?? "",
        referenceLink: profile.referenceLink ?? "",
      });
    }
  }, [profile]);


  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };


  const handleGenderChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };


  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      candidateId: formData.candidateId || null,
      surname: formData.surname || null,
      name: formData.name || null,
      about: formData.about || null,
      birthday: formData.birthday || null,
      gender: formData.gender ?? null,
      province: formData.province || null,
      commune: formData.commune || null,
      referenceLink: formData.referenceLink || null,
    };

    await updateProfile(payload);
    toast.success("Cập nhật hồ sơ thành công!");
  };



  if (isLoading) {
    return (
      <div className="bg-card-bg p-8 rounded-[2rem] shadow-sm border border-card-border text-center py-20">
        <div className="text-gray-400 text-lg">Đang tải thông tin cá nhân...</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card-bg p-8 rounded-[2rem] shadow-sm border border-card-border transition-all"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-text-main tracking-tight">
            Thông tin cá nhân
          </h2>
          <p className="text-sm text-text-muted font-medium">
            Quản lý hồ sơ công khai của bạn.
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">

          <button
            type="submit"
            disabled={isLoading || isUpdating}
            className="px-6 py-2.5 bg-[#00c853] text-white font-black rounded-xl hover:bg-[#00a846] transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="space-y-2 mt-3">
          <label className="text-sm font-black text-text-muted ml-1">
            Họ và tên đệm
          </label>
          <input
            type="text"
            value={formData.surname}
            onChange={handleChange("surname")}
            className="w-full mt-2 p-3.5 rounded-2xl border border-card-border bg-background focus:ring-2 focus:ring-[#00c853] outline-none font-medium text-text-main"
          />
        </div>

        <div className="space-y-2 mt-3">
          <label className="text-sm font-black text-text-muted ml-1">
            Tên
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            className="w-full mt-2 p-3.5 rounded-2xl border border-card-border bg-background focus:ring-2 focus:ring-[#00c853] outline-none font-medium text-text-main"
          />
        </div>

        <div className="space-y-2 mt-3">
          <label className="text-sm font-black text-text-muted ml-1">
            Ngày sinh
          </label>
          <input
            type="date"
            value={formData.birthday}
            onChange={handleChange("birthday")}
            className="w-full mt-2 p-3.5 rounded-2xl border border-card-border bg-background focus:ring-2 focus:ring-[#00c853] outline-none font-medium text-text-main"
          />
        </div>

        <div className="space-y-2 mt-3">
          <label className="text-sm font-black text-text-muted ml-1">
            Giới tính
          </label>
          <div className="flex gap-3 mt-2">
            {[
              { label: "Nam", value: true },
              { label: "Nữ", value: false },
            ].map(({ label, value }) => {
              const isSelected = formData.gender === value;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleGenderChange(value)}
                  className={`flex-1 py-3.5 rounded-2xl font-black text-sm border-2 transition-all active:scale-95 ${isSelected
                    ? "bg-[#00c853] text-white border-[#00c853] shadow-md"
                    : "bg-background text-text-muted border-card-border hover:border-[#00c853]/50"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 mt-3">
          <label className="text-sm font-black text-text-muted ml-1">
            Tỉnh/Thành phố
          </label>
          <input
            type="text"
            placeholder="VD: TP. Hồ Chí Minh"
            value={formData.province}
            onChange={handleChange("province")}
            className="w-full mt-2 p-3.5 rounded-2xl border border-card-border bg-background focus:ring-2 focus:ring-[#00c853] outline-none font-medium text-text-main"
          />
        </div>

        <div className="space-y-2 mt-3">
          <label className="text-sm font-black text-text-muted ml-1">
            Xã/Phường
          </label>
          <input
            type="text"
            placeholder="VD: Phường 1"
            value={formData.commune}
            onChange={handleChange("commune")}
            className="w-full mt-2 p-3.5 rounded-2xl border border-card-border bg-background focus:ring-2 focus:ring-[#00c853] outline-none font-medium text-text-main"
          />
        </div>

        <div className="space-y-2 mt-3">
          <label className="text-sm font-black text-text-muted ml-1">
            Email
          </label>
          <input
            type="email"
            readOnly
            value={formData.email}
            onChange={handleChange("email")}
            className="w-full mt-2 p-3.5 rounded-2xl border border-card-border bg-background focus:ring-2 focus:ring-[#00c853] outline-none font-medium text-text-main"
          />
        </div>

        <div className="space-y-2 mt-3">
          <label className="text-sm font-black text-text-muted ml-1">
            Số điện thoại
          </label>
          <input
            type="tel"
            readOnly
            value={formData.phone}
            onChange={handleChange("phone")}
            className="w-full mt-2 p-3.5 rounded-2xl border border-card-border bg-background focus:ring-2 focus:ring-[#00c853] outline-none font-medium text-text-main"
          />
        </div>

        <div className="md:col-span-2 space-y-2 mt-3">
          <label className="text-sm font-black text-text-muted ml-1">
            Link tham chiếu (GitHub, LinkedIn, Portfolio...)
          </label>
          <input
            type="url"
            placeholder="https://github.com/yourusername hoặc https://linkedin.com/in/yourprofile"
            value={formData.referenceLink}
            onChange={handleChange("referenceLink")}
            className="w-full mt-2 p-3.5 rounded-2xl border border-card-border bg-background focus:ring-2 focus:ring-[#00c853] outline-none font-medium text-text-main"
          />
        </div>

        <div className="md:col-span-2 space-y-2 mt-6">
          <label className="text-sm font-black text-text-muted ml-1">
            Giới thiệu bản thân
          </label>
          <textarea
            rows="8"
            value={formData.about}
            onChange={handleChange("about")}
            className="w-full mt-2 p-5 rounded-2xl border border-card-border bg-background focus:ring-2 focus:ring-[#00c853]/50 focus:ring-offset-2 outline-none resize-vertical font-medium text-base leading-relaxed min-h-[200px] max-h-[400px] text-text-main"
            placeholder="Kể về kinh nghiệm làm việc, kỹ năng chuyên môn, thành tựu nổi bật và mục tiêu nghề nghiệp của bạn..."
          />
          <p className="text-xs text-gray-500 mt-2">
            Tối đa 1000 ký tự. Nội dung sẽ hiển thị công khai trên hồ sơ.
          </p>
        </div>
      </div>
    </form>
  );
};

export default PersonalInfoForm;