"use client"; // Client Component vì có nhập liệu
import React from "react";
import Link from "next/link";
import { FaUser, FaLock, FaGoogle, FaFacebookF } from "react-icons/fa"; // Nhớ cài: npm i react-icons
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const LoginForm = () => {
  return (
    <div className="w-full max-w-[380px] mx-auto">
      <h2 className="text-3xl font-black text-center mb-10 uppercase tracking-wide text-black">
        LOGIN
      </h2>

      <form>
        <Input icon={<FaUser />} placeholder="User-name" />
        <Input icon={<FaLock />} type="password" placeholder="Password" />

        <div className="text-right mb-6 -mt-2">
          <Link href="#" className="text-sm text-[#0056b3] hover:underline">
            Forgot-password ?
          </Link>
        </div>

        <Button variant="primary" className="mb-4 w-[160px] mx-auto">
          Login Now
        </Button>

        <div className="text-center mb-8">
          <Link
            href="/register"
            className="text-sm text-[#0056b3] font-medium hover:underline"
          >
            Create account
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-[1px] bg-gray-200 flex-1"></div>
          <span className="text-sm text-gray-500 font-bold px-2">
            Login with Others
          </span>
          <div className="h-[1px] bg-gray-200 flex-1"></div>
        </div>

        <div className="space-y-3">
          <Button variant="social">
            <FaGoogle className="text-[#EA4335] text-xl" />
            <span className="text-sm font-semibold text-gray-700">
              Login with google
            </span>
          </Button>
          <Button variant="social">
            <FaFacebookF className="text-[#1877F2] text-xl" />
            <span className="text-sm font-semibold text-gray-700">
              Login with Facebook
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
