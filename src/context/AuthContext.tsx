"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from '@/services/auth.service';

export const ROLES = {
    ADMIN: 'admin',
    RECRUITER: 'recruiter',
    CANDIDATE: 'candidate',
};

const parseUser = (result: any) => ({
    id: result.accountId,
    email: result.email,
    status: result.status,
    roles: result.roles ?? [],
});

interface AuthContextType {
    user: any;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    isAdmin: boolean;
    isRecruiter: boolean;
    isCandidate: boolean;
    hasRole: (role: string) => boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (payload: any) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    loginWithGoogle: (credentialResponse: any) => Promise<{ success: boolean }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // 2. Login
    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await authService.login(email, password);
            const parsedUser = parseUser(result);
            setUser(parsedUser);
            setIsAuthenticated(true);

            toast.success("Đăng nhập thành công!");

            const roles = parsedUser.roles;
            if (roles.includes(ROLES.ADMIN)) router.push("/admin");
            else if (roles.includes(ROLES.RECRUITER)) router.push("/employer/dashboard");
            else if (roles.includes(ROLES.CANDIDATE)) router.push("/");
            else router.push("/");

            return { success: true };
        } catch (err: any) {
            const errorMsg = 'Đăng nhập thất bại! Email hoặc mật khẩu sai';
            setError(errorMsg);
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    // 3. Register  
    const register = useCallback(async (payload: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await authService.register(payload);
            const parsedUser = parseUser(result);
            setUser(parsedUser);
            setIsAuthenticated(true);

            toast.success("Đăng ký thành công!");
            router.push("/login");
            return { success: true };
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Đăng ký thất bại';
            setError(errorMsg);
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    // 4. Logout
    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
            router.push("/login");
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    // 5. Google Login
    const loginWithGoogle = useCallback(async (credentialResponse: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await authService.googleLogin(credentialResponse);
            if (result.accessToken) {
                const parsedUser = parseUser(result);
                setUser(parsedUser);
                setIsAuthenticated(true);
                toast.success("Đăng nhập bằng Google thành công!");

                const roles = parsedUser.roles;
                if (roles.includes(ROLES.ADMIN)) router.push("/admin");
                else if (roles.includes(ROLES.RECRUITER)) router.push("/employer/dashboard");
                else if (roles.includes(ROLES.CANDIDATE)) router.push("/");
                else router.push("/");

                return { success: true };
            }
            return { success: false };
        } catch (err) {
            const errorMsg = "Đăng nhập Google thất bại";
            setError(errorMsg);
            toast.error(errorMsg);
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const hasRole = useCallback((role: string) => user?.roles?.includes(role) ?? false, [user]);
    const isAdmin = hasRole(ROLES.ADMIN);
    const isRecruiter = hasRole(ROLES.RECRUITER);
    const isCandidate = hasRole(ROLES.CANDIDATE);

    return (
        <AuthContext.Provider value={{
            user, isLoading, isAuthenticated, error,
            isAdmin, isRecruiter, isCandidate, hasRole,
            login, register, logout, loginWithGoogle,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth phải dùng trong AuthProvider");
    return context;
};
