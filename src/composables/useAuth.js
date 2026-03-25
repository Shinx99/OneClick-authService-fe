"use client";
import { useState, useCallback } from "react";              // React hooks
import { useRouter } from "next/navigation";                // Next.js router
import toast from "react-hot-toast";                        // React toast
import { authService } from '@/services/auth.service';      // Service
import { success } from "zod";


export const useAuth = () => {

    // 1. React hook: useState
    const [user, setUser] = useState(null);                             // User info
    const [isLoading, setIsLoading] = useState(false);                  // Loading spinner
    const [isAuthenticated, setIsAuthenticated] = useState(false);      // Login state
    const [error, setError] = useState(null);                           // Error message

    const router = useRouter();



    // 2. Login
    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await authService.login(email, password);
            setUser(result);
            setIsAuthenticated(true);

            toast.success("Đăng nhập thành công!");
            router.push("/");
            return { success: true };
        } catch (err) {
            // const errorMsg = err.response?.data?.message || 'Đăng nhập thất bại';
            const errorMsg = 'Đăng nhập thất bại! Email hoặc mật khẩu sai';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [router]);



    // 3. Register
    const register = useCallback(async (payload) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await authService.register(payload);
            setUser(result);
            setIsAuthenticated(true);

            toast.success("Đăng ký thành công!");
            router.push("/");
            return { success: true };
        } catch (err) {
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
    const loginWithGoogle = useCallback(
        async (credentialResponse) => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await authService.googleLogin(credentialResponse);

                if (result.accessToken) {
                    const user = {
                        id: result.accountId,
                        email: result.email,
                        status: result.status,
                        roles: result.roles,
                    };
                    setUser(user);
                    setIsAuthenticated(true);
                    toast.success("Đăng nhập bằng Google thành công!");
                    router.push("/");
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
        },
        [router]
    );


    // Linkedin Login
    // const loginWithLinkedIn = useCallback(
    //     async (code) => {
    //         setIsLoading(true)
    //         setError(null);
    //         try {
    //             const result = await authService.linkedinLogin(code);

    //             if (result.accessToken) {
    //                 const user = {
    //                     id: result.accountId,
    //                     email: result.email,
    //                     status: result.status,
    //                     roles: result.roles,
    //                 };
    //                 setUser(user);
    //                 setIsAuthenticated(true);
    //                 toast.success("Đăng nhập LinkedIn thành công!");
    //                 router.push("/");
    //                 return { success: true };
    //             }
    //             return { success: false };
    //         } catch (err) {
    //             const errorMsg = "Đăng nhập LinkedIn thất bại";
    //             setError(errorMsg);
    //             toast.error(errorMsg);
    //             return { success: false };
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }, [router]
    // );


    // 5
    return {

        // State
        user,
        isLoading,
        isAuthenticated,
        error,

        // Actions
        login,
        register,
        logout,
        loginWithGoogle,
        //loginWithLinkedIn,
    };
};