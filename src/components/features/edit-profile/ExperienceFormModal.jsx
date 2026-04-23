"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";

const ExperienceFormModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customCompanyName: "",
      headline: "",
      employmentType: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      locationType: "",
      employmentLocation: "",
      employmentIndustry: "",
    },
  });

  const isCurrent = watch("isCurrent");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // Validate ngày kết thúc >= ngày bắt đầu
  useEffect(() => {
    if (!isCurrent && startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        setError("endDate", {
          type: "manual",
          message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
        });
      } else {
        clearErrors("endDate");
      }
    }
  }, [startDate, endDate, isCurrent, setError, clearErrors]);

  // Reset form khi modal mở
  useEffect(() => {
    if (initialData) {
      const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toISOString().split("T")[0];
      };
      reset({
        ...initialData,
        startDate: formatDateForInput(initialData.startDate),
        endDate: formatDateForInput(initialData.endDate),
      });
    } else {
      reset({
        customCompanyName: "",
        headline: "",
        employmentType: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
        locationType: "",
        employmentLocation: "",
        employmentIndustry: "",
      });
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card-bg w-full max-w-2xl rounded-3xl shadow-2xl border border-card-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
          <h3 className="text-xl font-black text-text-main">
            {initialData ? "Chỉnh sửa kinh nghiệm" : "Thêm kinh nghiệm mới"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Tên công ty */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-1">
              Tên công ty *
            </label>
            <input
              {...register("customCompanyName", { required: "Vui lòng nhập tên công ty" })}
              className="w-full p-3 border border-card-border rounded-xl bg-background"
              placeholder="VD: Công ty TNHH ABC"
            />
            {errors.customCompanyName && (
              <p className="text-red-500 text-xs mt-1">{errors.customCompanyName.message}</p>
            )}
          </div>

          {/* Chức danh */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-1">
              Chức danh / Vị trí *
            </label>
            <input
              {...register("headline", { required: "Vui lòng nhập chức danh" })}
              className="w-full p-3 border border-card-border rounded-xl bg-background"
              placeholder="VD: Frontend Developer"
            />
            {errors.headline && <p className="text-red-500 text-xs mt-1">{errors.headline.message}</p>}
          </div>

          {/* Loại công việc */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-1">Loại công việc</label>
            <select
              {...register("employmentType")}
              className="w-full p-3 border border-card-border rounded-xl bg-background"
            >
              <option value="">-- Chọn loại công việc --</option>
              <option value="Toàn thời gian">Toàn thời gian</option>
              <option value="Bán thời gian">Bán thời gian</option>
              <option value="Thực tập">Thực tập</option>
              <option value="Freelance">Freelance</option>
              <option value="Hợp đồng">Hợp đồng</option>
            </select>
          </div>

          {/* Ngày bắt đầu & kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-text-muted mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full p-3 border border-card-border rounded-xl bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-muted mb-1">Ngày kết thúc</label>
              <input
                type="date"
                {...register("endDate", {
                  validate: (value) => {
                    if (isCurrent) return true;
                    if (startDate && value && new Date(value) < new Date(startDate)) {
                      return "Ngày kết thúc phải sau ngày bắt đầu";
                    }
                    return true;
                  },
                })}
                disabled={isCurrent}
                className="w-full p-3 border border-card-border rounded-xl bg-background disabled:opacity-50"
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
            </div>
          </div>

          {/* Checkbox đang làm việc */}
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("isCurrent")} id="isCurrent" />
            <label htmlFor="isCurrent" className="text-sm font-medium text-text-muted">
              Đang làm việc tại đây
            </label>
          </div>

          {/* Địa điểm làm việc */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-1">Địa điểm</label>
            <input
              {...register("employmentLocation")}
              className="w-full p-3 border border-card-border rounded-xl bg-background"
              placeholder="VD: Hà Nội / Remote"
            />
          </div>

          {/* Loại địa điểm (Onsite/Remote/Hybrid) */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-1">Hình thức làm việc</label>
            <select
              {...register("locationType")}
              className="w-full p-3 border border-card-border rounded-xl bg-background"
            >
              <option value="">-- Chọn hình thức --</option>
              <option value="Onsite">Tại văn phòng</option>
              <option value="Remote">Làm việc từ xa</option>
              <option value="Hybrid">Kết hợp</option>
            </select>
          </div>

          {/* Ngành nghề công ty (tùy chọn) */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-1">Ngành nghề</label>
            <input
              {...register("employmentIndustry")}
              className="w-full p-3 border border-card-border rounded-xl bg-background"
              placeholder="VD: Công nghệ thông tin"
            />
          </div>

          {/* Mô tả công việc */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-1">Mô tả công việc</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full p-3 border border-card-border rounded-xl bg-background"
              placeholder="Mô tả ngắn gọn về công việc, trách nhiệm..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-card-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#00c853] text-white font-black rounded-xl hover:bg-[#00a846] disabled:opacity-70"
            >
              {isSubmitting ? "Đang lưu..." : initialData ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExperienceFormModal;