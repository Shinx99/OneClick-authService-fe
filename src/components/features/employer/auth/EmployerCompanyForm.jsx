"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaBuilding, FaGlobe, FaIdCard, FaInfoCircle, FaUsers, FaLeaf } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const EmployerCompanyForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      industry: "IT - Software",
      companySize: "51-200",
      website: "",
      taxCode: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("Submit company profile:", data);
      toast.success("Cập nhật thông tin công ty thành công!");
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/employer-register/pending");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Company Profile</h1>
        <p className="text-gray-500 text-sm">Tell us more about your company to attract the best talent.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Row 1: Industry & Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-2">
          <div className="relative mb-4 flex flex-col justify-center">
            <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Industry</span>
            <div className="relative flex items-center bg-white border-[2px] border-gray-200 rounded-xl px-4 h-[56px] transition-all focus-within:border-green-500 mt-2">
              <span className="text-gray-400 mr-3 text-lg"><FaBuilding /></span>
              <select className="w-full bg-transparent border-none outline-none text-gray-800 text-[15px] font-semibold appearance-none" {...register("industry")}>
                <option value="IT - Software">IT - Phần mềm</option>
                <option value="Finance">Tài chính - Ngân hàng</option>
                <option value="Education">Giáo dục</option>
                <option value="Retail">Bán lẻ - Tiêu dùng</option>
              </select>
            </div>
            {errors.industry && <p className="absolute -bottom-1 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.industry.message}</p>}
          </div>

          <div className="relative mb-4 flex flex-col justify-center">
            <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Company Size</span>
            <div className="relative flex items-center bg-white border-[2px] border-gray-200 rounded-xl px-4 h-[56px] transition-all focus-within:border-green-500 mt-2">
              <span className="text-gray-400 mr-3 text-lg"><FaUsers /></span>
              <select className="w-full bg-transparent border-none outline-none text-gray-800 text-[15px] font-semibold appearance-none" {...register("companySize")}>
                <option value="1-10">1 - 10 employees</option>
                <option value="11-50">11 - 50 employees</option>
                <option value="51-200">51 - 200 employees</option>
                <option value="200+">200+ employees</option>
              </select>
            </div>
            {errors.companySize && <p className="absolute -bottom-1 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.companySize.message}</p>}
          </div>
        </div>

        {/* Row 2: Website & Tax code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-2">
          <div className="relative mb-4">
            <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Website URL</span>
            <Input icon={<FaGlobe />} placeholder="https://example.com" {...register("website")} />
            {errors.website && <p className="absolute -bottom-1 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.website.message}</p>}
          </div>

          <div className="relative mb-4">
            <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Tax Code (Required)</span>
            <Input icon={<FaIdCard />} placeholder="Mã số thuế" {...register("taxCode")} />
            {errors.taxCode && <p className="absolute -bottom-1 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.taxCode.message}</p>}
          </div>
        </div>

        {/* Row 3: Description */}
        <div className="relative mb-6">
          <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Company Description</span>
          <div className="relative flex bg-white border-[2px] border-gray-200 rounded-xl px-4 py-3 transition-all focus-within:border-green-500 mt-2">
             <span className="text-gray-400 mr-3 text-lg mt-1"><FaInfoCircle /></span>
             <textarea 
                className="w-full min-h-[100px] bg-transparent border-none outline-none text-gray-800 text-[15px] font-medium resize-none"
                placeholder="A brief introduction about your company, mission, and culture..."
                {...register("description")}
             ></textarea>
          </div>
          {errors.description && <p className="absolute -bottom-5 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.description.message}</p>}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full bg-[#00D06A] hover:bg-green-600 text-white font-semibold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,208,106,0.39)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Submit Profile"}
          <span className="text-lg">→</span>
        </Button>
      </form>
    </div>
  );
};

export default EmployerCompanyForm;
