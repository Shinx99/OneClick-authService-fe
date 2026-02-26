import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/features/auth/LoginForm";
import RegisterForm from "@/components/features/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <AuthLayout
      initialIsRegister={true}
      loginForm={<LoginForm />}
      registerForm={<RegisterForm />}
    />
  );
};

export default RegisterPage;
