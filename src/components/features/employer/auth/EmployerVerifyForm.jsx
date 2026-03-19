"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaShieldAlt } from "react-icons/fa";
import { FaLeaf } from "react-icons/fa6";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const EmployerVerifyForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("Verify OTP:", data.otp);
      toast.success("Xác minh thành công!");
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/employer-register/company");
    } catch (error) {
      toast.error("Mã OTP không hợp lệ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
  

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <FaShieldAlt />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-500 text-sm">
          We sent a 6-digit verification code to your email. Enter the code to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative mb-6 flex flex-col justify-center text-left">
          <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Verification Code</span>
          <Input 
            icon={<FaShieldAlt />} 
            placeholder="Enter 6-digit code" 
            maxLength={6}
            {...register("otp")} 
          />
          {errors.otp && (
            <p className="absolute -bottom-1 left-1 mt-1 text-red-500 text-[11px] font-semibold">{errors.otp.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full bg-[#00D06A] hover:bg-green-600 text-white font-semibold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,208,106,0.39)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Didn't receive the code?{" "}
          <button className="font-semibold text-[#00D06A] hover:underline cursor-pointer">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmployerVerifyForm;
