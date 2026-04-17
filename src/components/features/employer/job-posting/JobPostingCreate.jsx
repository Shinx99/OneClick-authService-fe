"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdOutlineSave,
  MdOutlinePublish,
  MdOutlineLocationOn,
  MdOutlineRestartAlt,
  MdOutlineImage,
  MdClose,
} from "react-icons/md";
import { jobService } from "@/services/job.service";

// ===== OPTIONS =====
const LEVEL_OPTIONS = [
  { value: "intern", label: "Thực tập sinh" },
  { value: "fresher", label: "Fresher" },
  { value: "junior", label: "Junior" },
  { value: "middle", label: "Middle" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
];

const JOB_TYPE_OPTIONS = [
  { value: "full-time", label: "Toàn thời gian" },
  { value: "part-time", label: "Bán thời gian" },
  { value: "remote", label: "Từ xa" },
  { value: "freelance", label: "Freelance" },
  { value: "contract", label: "Hợp đồng" },
  { value: "hybrid", label: "Hybrid" },
  { value: "internship", label: "Thực tập" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Đang tuyển" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "closed", label: "Đã đóng" },
];

// ===== STYLES =====
const inputClass =
  "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all";
const labelClass = "block text-sm font-medium text-slate-600 mb-1.5";
const errorClass = "text-xs text-red-500 mt-1";

// ===== MAIN COMPONENT =====
const JobPostingForm = ({ jobId }) => {
  const router = useRouter();
  const isEditMode = Boolean(jobId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      requirement: "",
      majorPreferred: "",
      level: "",
      jobType: "",
      province: "",
      commune: "",
      salaryMin: "",
      salaryMax: "",
      experienceMinYear: "",
      applicationDeadline: "",
      status: "active",
      imgUrl: "",
    },
  });

  // ===== LOAD JOB DATA FOR EDIT MODE =====
  useEffect(() => {
    if (!isEditMode) return;
    const loadJob = async () => {
      setIsLoadingJob(true);
      try {
        const job = await jobService.getJobById(jobId);
        // Set form values
        setValue("title", job.title || "");
        setValue("description", job.description || "");
        setValue("requirement", job.requirement || "");
        setValue("majorPreferred", job.majorPreferred || "");
        setValue("level", job.level || "");
        setValue("jobType", job.jobType || "");
        setValue("province", job.province || "");
        setValue("commune", job.commune || "");
        setValue("salaryMin", job.salaryMin ?? "");
        setValue("salaryMax", job.salaryMax ?? "");
        setValue("experienceMinYear", job.experienceMinYear ?? "");
        setValue("applicationDeadline", job.applicationDeadline || "");
        setValue("status", job.status || "active");
        setValue("imgUrl", job.imgUrl || "");
        // Set skills
        if (job.skills?.length) {
          setSkills(job.skills.map((s) => s.skillName));
        }
        // Set image preview
        if (job.imgUrl) {
          setImagePreview(job.imgUrl);
        }
      } catch (err) {
        console.error("Load job error:", err);
        toast.error("Không thể tải thông tin bài đăng");
      } finally {
        setIsLoadingJob(false);
      }
    };
    loadJob();
  }, [jobId, isEditMode, setValue]);

  // ===== SKILL HANDLERS =====
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  // ===== IMAGE HANDLERS =====
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh hợp lệ");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh tối đa là 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ===== SUBMIT =====
  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : 0,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : 0,
        experienceMinYear: formData.experienceMinYear
          ? Number(formData.experienceMinYear)
          : 0,
        skillNames: skills.length > 0 ? skills : undefined,
      };

      // Remove empty string fields to let BE keep old values on update
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "" || payload[key] === undefined) {
          delete payload[key];
        }
      });

      let resultJobId = jobId;

      if (isEditMode) {
        await jobService.updateJob(jobId, payload);
        toast.success("Cập nhật bài đăng thành công!");
      } else {
        const res = await jobService.createJob(payload);
        resultJobId = res.data?.jobId;
        toast.success("Tạo bài đăng thành công!");
      }

      // Upload image if a new file was selected
      if (imageFile && resultJobId) {
        try {
          await jobService.uploadJobImage(resultJobId, imageFile);
          toast.success("Ảnh đã được upload thành công!");
        } catch (imgErr) {
          console.error("Image upload error:", imgErr);
          toast.error("Bài đăng đã lưu nhưng upload ảnh thất bại");
        }
      }

      router.push("/employer/job-posting");
    } catch (err) {
      console.error("Submit error:", err);
      const msg =
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== RESET =====
  const handleReset = () => {
    reset();
    setSkills([]);
    setSkillInput("");
    removeImage();
    toast("Đã xóa toàn bộ form", { icon: "🔄" });
  };

  // ===== LOADING STATE =====
  if (isLoadingJob) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {isEditMode ? "Chỉnh sửa tin tuyển dụng" : "Tạo tin tuyển dụng mới"}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isEditMode
              ? "Cập nhật thông tin bài đăng tuyển dụng"
              : "Điền thông tin chi tiết để đăng tin tuyển dụng mới"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-all"
          >
            <MdOutlineRestartAlt className="w-5 h-5" /> Reset
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <MdOutlinePublish className="w-5 h-5" />
                {isEditMode ? "Cập nhật" : "Đăng tin"}
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* SECTION 1: Thông tin chung */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">
              1
            </span>
            Thông tin chung
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-2">
              <label className={labelClass}>
                Chức danh <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title", { required: "Vui lòng nhập chức danh" })}
                placeholder="VD: Senior Java Backend Developer"
                className={inputClass}
              />
              {errors.title && (
                <p className={errorClass}>{errors.title.message}</p>
              )}
            </div>

            {/* Level */}
            <div>
              <label className={labelClass}>Cấp bậc</label>
              <select {...register("level")} className={`${inputClass} text-slate-600`}>
                <option value="">Chọn cấp bậc</option>
                {LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div>
              <label className={labelClass}>Hình thức làm việc</label>
              <select {...register("jobType")} className={`${inputClass} text-slate-600`}>
                <option value="">Chọn hình thức</option>
                {JOB_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Major Preferred */}
            <div className="col-span-2">
              <label className={labelClass}>Chuyên ngành ưu tiên</label>
              <input
                {...register("majorPreferred")}
                placeholder="VD: Công nghệ thông tin, Khoa học máy tính"
                className={inputClass}
              />
            </div>

            {/* Status */}
            <div>
              <label className={labelClass}>Trạng thái</label>
              <select {...register("status")} className={`${inputClass} text-slate-600`}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className={labelClass}>Kinh nghiệm tối thiểu (năm)</label>
              <input
                type="number"
                min="0"
                {...register("experienceMinYear")}
                placeholder="VD: 2"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Chi tiết công việc */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">
              2
            </span>
            Chi tiết công việc
          </h3>
          <div className="space-y-4">
            {/* Description */}
            <div>
              <label className={labelClass}>
                Mô tả công việc <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("description", { required: "Vui lòng nhập mô tả" })}
                placeholder="Mô tả vai trò và các trách nhiệm chính..."
                rows={5}
                className={`${inputClass} resize-none`}
              />
              {errors.description && (
                <p className={errorClass}>{errors.description.message}</p>
              )}
            </div>

            {/* Requirement */}
            <div>
              <label className={labelClass}>
                Yêu cầu ứng viên <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("requirement", { required: "Vui lòng nhập yêu cầu" })}
                placeholder="Liệt kê các kỹ năng, kinh nghiệm yêu cầu..."
                rows={5}
                className={`${inputClass} resize-none`}
              />
              {errors.requirement && (
                <p className={errorClass}>{errors.requirement.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: Lương & Địa điểm */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">
              3
            </span>
            Lương & Địa điểm
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Salary Min */}
            <div>
              <label className={labelClass}>Lương tối thiểu (VNĐ)</label>
              <input
                type="number"
                min="0"
                {...register("salaryMin")}
                placeholder="VD: 15000000"
                className={inputClass}
              />
            </div>

            {/* Salary Max */}
            <div>
              <label className={labelClass}>Lương tối đa (VNĐ)</label>
              <input
                type="number"
                min="0"
                {...register("salaryMax")}
                placeholder="VD: 30000000"
                className={inputClass}
              />
            </div>

            {/* Province */}
            <div>
              <label className={labelClass}>Tỉnh/Thành phố</label>
              <div className="relative">
                <MdOutlineLocationOn className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  {...register("province")}
                  placeholder="VD: TP. Hồ Chí Minh"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Commune */}
            <div>
              <label className={labelClass}>Quận/Huyện</label>
              <input
                {...register("commune")}
                placeholder="VD: Quận 1"
                className={inputClass}
              />
            </div>

            {/* Application Deadline */}
            <div>
              <label className={labelClass}>Hạn nộp hồ sơ</label>
              <input
                type="date"
                {...register("applicationDeadline")}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Kỹ năng */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">
              4
            </span>
            Kỹ năng yêu cầu
          </h3>
          <div>
            <label className={labelClass}>
              Thêm kỹ năng (nhấn Enter hoặc dấu phẩy để thêm)
            </label>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="VD: React, Java, Python..."
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all shrink-0"
              >
                Thêm
              </button>
            </div>
            {/* Skill tags */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-emerald-200 transition-colors"
                    >
                      <MdClose className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 5: Ảnh bìa */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">
              5
            </span>
            Ảnh bìa bài đăng
          </h3>

          {imagePreview ? (
            <div className="relative w-full max-w-md">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl border border-slate-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-md h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group"
            >
              <MdOutlineImage className="w-10 h-10 text-slate-300 group-hover:text-emerald-400 transition-colors mb-2" />
              <p className="text-sm text-slate-400 group-hover:text-emerald-600 font-medium">
                Nhấn để chọn ảnh bìa
              </p>
              <p className="text-xs text-slate-300 mt-1">PNG, JPG tối đa 5MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Submit Button (bottom) */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all"
          >
            <MdOutlineRestartAlt className="w-5 h-5" /> Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <MdOutlinePublish className="w-5 h-5" />
                {isEditMode ? "Cập nhật tin tuyển dụng" : "Đăng tin tuyển dụng"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPostingForm;
