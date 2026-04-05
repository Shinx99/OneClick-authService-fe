"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import candidateService from "@/services/candidate.service";

export const ROLES = {
  ADMIN: "admin",
  RECRUITER: "recruiter",
  CANDIDATE: "candidate",
};

// Đã bỏ : any
const parseUser = (result) => ({
  id: result.accountId,
  email: result.email,
  status: result.status,
  roles: result.roles ?? [],
});

// Đã bỏ interface AuthContextType
// Đã bỏ Generic <AuthContextType | null>
const AuthContext = createContext(null);

// Đã bỏ khai báo kiểu cho { children }
export const AuthProvider = ({ children }) => {
  // Đã bỏ <any> và <string | null>
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 1. Tự động refresh auth khi app chạy (bao gồm F5)
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      const refreshed = await authService.refreshAuth(); // Gọi refreshAuth trong service

      if (refreshed && refreshed.data) {
        const result = refreshed.data;
        const parsedUser = parseUser(result);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    if (typeof window !== "undefined") {
      // Chỉ chạy ở client
      initAuth();
    }
  }, []);

  // 2. Login (Đã bỏ : string)
  const login = useCallback(
    async (email, password) => {
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
        else if (roles.includes(ROLES.RECRUITER))
          router.push("/employer/dashboard");
        else if (roles.includes(ROLES.CANDIDATE)) router.push("/");
        else router.push("/");

        return { success: true };
      } catch (err) {
        // Đã bỏ : any
        const errorMsg = "Đăng nhập thất bại! Email hoặc mật khẩu sai";
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  // 3. Register (Đã bỏ : any)
  const register = useCallback(
    async (payload) => {
      setIsLoading(true);
      setError(null);
      try {
        await authService.register(payload);

        toast.success("Đăng ký thành công! Vui lòng check mail...");

        router.push("/login");
        return { success: true };
      } catch (err) {
        // Đã bỏ : any
        // Thêm optional chaining (?) để tránh lỗi văng app nếu err.response bị undefined
        const errorMsg = err?.response?.data?.message || "Đăng ký thất bại";
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  // --- 6. Change Password ---
  const changePassword = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.changePassword(payload);
      toast.success("Đổi mật khẩu thành công!");
      return { success: true };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Đổi mật khẩu thất bại";
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- 7. Forgot Password ---
  const sendForgotPasswordEmail = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi đến service bạn đã viết
      await authService.forgotPassword(email);
      toast.success("Yêu cầu thành công! Vui lòng kiểm tra email.");
      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Email không tồn tại hoặc lỗi hệ thống";
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const executeResetPassword = useCallback(
    async (token, newPassword) => {
      setIsLoading(true);
      try {
        // Gọi đến authService.resetPassword(token, newPassword)
        await authService.resetPassword(token, newPassword);
        toast.success("Mật khẩu đã được thay đổi! Hãy đăng nhập lại.");
        router.push("/login"); // Chuyển hướng về trang đăng nhập
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  // 4. Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
      toast.error("Có lỗi khi đăng xuất, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // 5. Google Login (Đã bỏ : any)
  const loginWithGoogle = useCallback(
    async (credentialResponse) => {
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
          else if (roles.includes(ROLES.RECRUITER))
            router.push("/employer/dashboard");
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
    },
    [router],
  );

  // Đã bỏ : string
  const hasRole = useCallback(
    (role) => user?.roles?.includes(role) ?? false,
    [user],
  );
  const isAdmin = hasRole(ROLES.ADMIN);
  const isRecruiter = hasRole(ROLES.RECRUITER);
  const isCandidate = hasRole(ROLES.CANDIDATE);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        error,
        isAdmin,
        isRecruiter,
        isCandidate,
        hasRole,
        login,
        register,
        logout,
        loginWithGoogle,
        changePassword,
        sendForgotPasswordEmail,
        executeResetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  return context;
};
