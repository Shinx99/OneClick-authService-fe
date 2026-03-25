"use client"; // Client Component vì có nhập liệu
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/validators/auth"; // Import bộ luật Zod
import { FaUser, FaLock, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/composables/useAuth";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"
//import { FaLinkedin } from "react-icons/fa";

const LoginForm = () => {

  // State: auth state
  const { login, isLoading, error, loginWithGoogle, loginWithLinkedIn } = useAuth();

  // State: open & close
  const [showError, setShowError] = useState(false);

  // Alert
  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error])

  // Alert
  const handleCloseError = () => {
    setShowError(false);
  };

  // Alert
  const handleInputChange = () => {
    if (showError) setShowError(false);
  }

  // Turn off alert when user interaction
  const handleUserInteraction = () => {
    if (showError) setShowError(false);
  };

  // Login with GOOGLE
  const googleLogin = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log("Google Success:", credentialResponse);
      loginWithGoogle(credentialResponse);
    },
    onError: (error) => { console.error("Google login error") },
    flow: "auth-code",
  });

  // Login with LINKEDIN
  const handleLinkedInLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    const redirectUri = 'http://localhost:3000';
    const scope = 'r_liteprofile r_emailaddress w_member_social';
    const state = 'linkedin_' + Date.now();

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;

    // Popup
    const popup = window.open(authUrl, 'linkedin', 'width=600,height=700');

    // Poll lấy code
    const interval = setInterval(async () => {
      if (popup.closed) {
        clearInterval(interval);
        return;
      }
      try {
        const currentUrl = popup.location.href;
        if (currentUrl.includes('code=')) {
          const params = new URLSearchParams(currentUrl.split('?')[1]);
          const code = params.get('code');
          if (code) {
            popup.close();
            clearInterval(interval);
            loginWithLinkedIn(code);  // ← Gọi composable đã có!
          }
        }
      } catch (e) { }
    }, 1000);
  };



  // Khởi tạo form với Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  // onSubmit function
  const onSubmit = (data) => {
    login(data.username, data.password);
  }


  return (
    <div className="w-full max-w-[380px] mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
        Đăng nhập tài khoản
      </h2>

      {/* ERROR ALERT - HIỂN THỊ LỖI TỪ BACKEND */}
      {showError && error && (
        <div className="group mb-6 animate-pulse">
          <div className="relative p-4 bg-gradient-to-r from-red-50 to-orange-50 
                          border-2 border-red-200 rounded-2xl shadow-xl 
                          backdrop-blur-sm hover:shadow-2xl transition-all duration-300">

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 pt-0.5 animate-bounce">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-900 leading-tight">
                  {error}
                </p>
              </div>

              {/* NÚT TẮT HOẠT ĐỘNG */}
              <button
                onClick={handleCloseError}  // Tắt alert
                className="ml-2 p-1.5 -mt-1 text-red-400 hover:text-red-600 
                           hover:bg-red-100 rounded-full transition-all duration-200 
                           opacity-0 group-hover:opacity-100 hover:scale-110"
                title="Đóng"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Bọc form bằng handleSubmit */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* --- Input Email --- */}
        <div className="mb-6 relative">
          <Input
            icon={<FaUser />}
            placeholder="Email"
            autoComplete="username"
            {...register("username", {
              onChange: handleUserInteraction
            })}
          />
          {errors.username && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* --- Input Mật khẩu --- */}
        <div className="mb-6 relative">
          <Input
            icon={<FaLock />}
            type="password"
            placeholder="Mật khẩu"
            autoComplete="current-password"
            {...register("password", {
              onChange: handleUserInteraction
            })}
          />
          {errors.password && (
            <p className="absolute top-full left-2 mt-1 text-red-500 text-[11px] font-semibold">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* --- Hàng Remember Me và Forget Password --- */}
        <div className="flex items-center justify-between mb-6 px-1">

          <div className="flex items-center gap-2">
          </div>

          <Link
            href="/forget-password"
            className="text-sm font-semibold text-[#0056b3] hover:underline transition-all"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* --- Nút Submit --- */}
        <Button
          type="submit"
          variant="primary"
          onClick={handleUserInteraction}
          className="mb-4 w-[160px] mx-auto bg-green-600 hover:bg-green-700 hover:shadow-green-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6 mt-4">
          <div className="h-[1px] bg-gray-200 flex-1"></div>
          <span className="text-sm text-gray-500 font-bold px-2">
            Hoặc đăng nhập với
          </span>
          <div className="h-[1px] bg-gray-200 flex-1"></div>
        </div>

        {/* Buttons Social */}
        <div className="space-y-3">

          {/* <Button variant="social" type="button" onClick={() => googleLogin()}>
            <FcGoogle className="text-[22px]" />
            <span className="text-sm font-semibold text-gray-700">Google</span>
          </Button> */}

          <Button variant="social" type="button" onClick={() => googleLogin()}>
            <FcGoogle className="text-[22px]" />
            <span className="text-sm font-semibold text-gray-700">Google</span>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("GoogleLogin credential:", credentialResponse.credential);
                loginWithGoogle(credentialResponse);
              }}
              onError={() => console.error("Google error")}
              useOneTap={false}
              size="large"
              text="continue_with"
              shape="rectangular"
              width="100%"
              theme="outline"
            />
          </Button>

        </div>
      </form >
    </div >
  );
};

export default LoginForm;
