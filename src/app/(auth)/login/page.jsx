import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/features/auth/LoginForm";
import RegisterForm from "@/components/features/auth/RegisterForm";

const LoginPage = () => {
  return (
    <AuthLayout
      initialIsRegister={false}
      loginForm={<LoginForm />}
      registerForm={<RegisterForm />}
    />
  );
};

export default LoginPage;
