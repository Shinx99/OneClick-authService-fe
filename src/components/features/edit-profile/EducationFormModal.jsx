"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaTimes, FaUpload, FaTrash } from "react-icons/fa";
import educationService from "@/services/education.service";
import toast from "react-hot-toast";

const EducationFormModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      imageUrl: "",
      referenceLink: "",
    },
  });

  const isCurrent = watch("isCurrent");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const imageUrl = watch("imageUrl");

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Tự động validate ngày bắt đầu và kết thúc
  useEffect(() => {
    if (!isCurrent && startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        setError("endDate", {
          type: "manual",
          message: "Năm tốt nghiệp phải sau hoặc bằng năm bắt đầu",
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
        schoolName: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
        imageUrl: "",
        referenceLink: "",
      });
    }
  }, [initialData, reset]);

  // Xử lý upload ảnh lên Cloudinary (tạm thời, không cần educationId)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file ảnh
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh hợp lệ");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      // Gọi API upload ảnh tạm (cần thêm method này trong educationService)
      const uploadedUrl = await educationService.uploadTemporaryImage(file);
      setValue("imageUrl", uploadedUrl, { shouldValidate: true });
      toast.success("Tải ảnh lên thành công");
    } catch (error) {
      console.error("Upload ảnh thất bại:", error);
      toast.error("Không thể tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Xóa ảnh đã chọn / đã upload
  const handleRemoveImage = () => {
    setValue("imageUrl", "", { shouldValidate: true });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card-bg w-full max-w-2xl rounded-3xl shadow-2xl border border-card-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
          <h3 className="text-xl font-black text-text-main">
            {initialData ? "Chỉnh sửa học vấn" : "Thêm học vấn mới"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Trường học */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-1">
              Trường / Cơ sở đào tạo *
            </label>
            <input
              {...register("schoolName", { required: "Vui lòng nhập tên trường" })}
              className="w-full p-3 border border-card-border rounded-xl bg-background focus:ring-2 focus:ring-[#00c853] outline-none"
              placeholder="VD: FPT Polytechnic College"
            />
            {errors.schoolName && (
              <p className="text-red-500 text-xs mt-1">{errors.schoolName.message}</p>
            )}
          </div>

          {/* Bằng cấp */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-1">Bằng cấp</label>
            <input
              {...register("degree")}
              className="w-full p-3 border border-card-border rounded-xl bg-background focus:ring-2 focus:ring-[#00c853] outline-none"
              placeholder="VD: Cử nhân / Kỹ sư / Chứng chỉ..."
            />
          </div>

          {/* Chuyên ngành */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-1">Chuyên ngành</label>
            <input
              {...register("fieldOfStudy")}
              className="w-full p-3 border border-card-border rounded-xl bg-background focus:ring-2 focus:ring-[#00c853] outline-none"
              placeholder="VD: Công nghệ thông tin"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Năm bắt đầu */}
            <div>
              <label className="block text-sm font-bold text-text-muted mb-1">Năm bắt đầu</label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full p-3 border border-card-border rounded-xl bg-background focus:ring-2 focus:ring-[#00c853] outline-none"
              />
            </div>

            {/* Năm tốt nghiệp */}
            <div>
              <label className="block text-sm font-bold text-text-muted mb-1">
                Năm tốt nghiệp
              </label>
              <input
                type="date"
                {...register("endDate", {
                  validate: (value) => {
                    if (isCurrent) return true;
                    if (startDate && value && new Date(value) < new Date(startDate)) {
                      return "Năm tốt nghiệp phải sau hoặc bằng năm bắt đầu";
                    }
                    return true;
                  },
                })}
                disabled={isCurrent}
                className="w-full p-3 border border-card-border rounded-xl bg-background disabled:opacity-50 focus:ring-2 focus:ring-[#00c853] outline-none"
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Checkbox đang theo học */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isCurrent")}
              id="isCurrent"
              className="w-4 h-4 text-[#00c853] rounded focus:ring-[#00c853]"
            />
            <label htmlFor="isCurrent" className="text-sm font-medium text-text-muted">
              Đang theo học
            </label>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-1">Mô tả</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full p-3 border border-card-border rounded-xl bg-background focus:ring-2 focus:ring-[#00c853] outline-none resize-none"
              placeholder="Thông tin thêm về khóa học, thành tích..."
            />
          </div>

          {/* UPLOAD ẢNH BẰNG CẤP (thay thế input URL) */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-1">
              Ảnh bằng cấp (nếu có)
            </label>
            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-card-border">
                <img
                  src={imageUrl}
                  alt="Bằng cấp"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-card-border rounded-xl p-6 text-center bg-background hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-1 pointer-events-none">
                  {isUploadingImage ? (
                    <div className="w-6 h-6 border-2 border-[#00c853] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaUpload className="text-gray-400" size={24} />
                  )}
                  <p className="text-sm font-medium text-text-muted">
                    {isUploadingImage ? "Đang tải ảnh lên..." : "Nhấp để chọn ảnh"}
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG tối đa 5MB</p>
                </div>
              </div>
            )}
            {/* Input ẩn để react-hook-form quản lý imageUrl */}
            <input type="hidden" {...register("imageUrl")} />
          </div>

          {/* Link tham khảo */}
          <div>
            <label className="block text-sm font-bold text-text-muted mb-1">
              Liên kết tham khảo
            </label>
            <input
              {...register("referenceLink")}
              className="w-full p-3 border border-card-border rounded-xl bg-background focus:ring-2 focus:ring-[#00c853] outline-none"
              placeholder="https://..."
            />
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-card-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="px-5 py-2.5 bg-[#00c853] text-white font-black rounded-xl hover:bg-[#00a846] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Đang lưu..." : initialData ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationFormModal;