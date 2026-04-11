"use client";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/features/auth/LoginForm";
import RegisterForm from "@/components/features/auth/RegisterForm";

export default function LoginRegisterLayout() {
    return (
        <AuthLayout
            loginForm={<LoginForm />}
            registerForm={<RegisterForm />}
        />
    );
}
