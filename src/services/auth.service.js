import { setAccessToken } from "@/lib/apiClient/api.config";
import { authClient } from "@/lib/apiClient/api.config";
import { jwtDecode } from "jwt-decode";

export const authService = {

  // -------------------------------------------------------
  // LOGIN
  // -------------------------------------------------------
  login: async (email, password) => {
    const { data } = await authClient.post('/auth/login', { email, password });

    // Save token into memory 
    if (data?.data?.accessToken) {
      setAccessToken(data.data.accessToken);
    }

    return data.data;
  },


  // -------------------------------------------------------
  // LOGIN WITH GOOGLE
  // -------------------------------------------------------
  googleLogin: async (credentialResponse) => {

    const credential = credentialResponse?.credential;

    if (!credential || typeof credential !== 'string') {
      throw new Error('Invalid Google credential: must be a string');
    }

    const decoded = jwtDecode(credentialResponse.credential);

    try {


      const { data } = await authClient.post("/auth/oauth/google/callback", {
        provider: "google",
        providerUserId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
      });

      if (data?.data.accessToken) {
        setAccessToken(data.data.accessToken);
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  },


  // -------------------------------------------------------
  // LOGIN WITH LINKEDIN
  // -------------------------------------------------------
  // linkedinLogin: async (code) => {

  //   // 1. Exchange code -> access token
  //   const tokenResponse = await fetch('http://www.linkedin.com/oauth/v2/accessToken', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     body: new URLSearchParams({
  //       grant_type: 'authorization_code',
  //       code: code,
  //       redirect_uri: 'http://localhost:3000',
  //       client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
  //       client_secret: process.env.LINKEDIN_CLIENT_SECRET,
  //     }),
  //   });

  //   const tokenData = await tokenResponse.json();
  //   const accessToken = tokenData.access_token;

  //   // 2. Get userInfo from Linkedin API
  //   const userResponse = await fetch('https://api.linkedin.com/v2/me?projection=(id,firstName,lastName)', {
  //     headers: { Authorization: `Bearer ${accessToken}` }
  //   });

  //   const userData = await userResponse.json();

  //   // 3. Send backend
  //   const { data } = await authClient.post("/auth/oauth/linkedin/callback", {
  //     provider: "linkedin",
  //     providerUserId: userData.id,
  //     email: `linkedin_${userData.id}@linkedin.com`,
  //     name: `${userData.firstName.localized.en_US} ${userData.lastName.localized.en_US}`,
  //   });

  //   if (data?.data?.accessToken) {
  //     setAccessToken(data.data.accessToken);
  //   }
  //   return data.data;
  // },




  // -------------------------------------------------------
  // REGISTER
  // -------------------------------------------------------
  register: async (payload) => {
    // payload: { email, password, fullName, role... }
    const { data } = await authClient.post('/auth/register', payload);
    return data.data;
  },

  // -------------------------------------------------------
  // LOGOUT
  // -------------------------------------------------------
  // logout: async () => {
  //   await authClient.post('/auth/logout'); // BE clear refresh_token cookie
  //   setAccessToken(null);                 // Clear memory
  // },

  logout: async () => {
    try {
      await authClient.post('/auth/logout');
    } catch (error) {
      // Log lỗi ra để biết
      console.warn("API Logout thất bại (có thể token đã hết hạn):", error.message);
    } finally {
      setAccessToken(null); // Clear memory
      // Nếu bạn có lưu token ở localStorage, hãy xóa nó tại đây luôn
      // localStorage.removeItem('token'); 
      // localStorage.removeItem('user');
    }
  },


  // -------------------------------------------------------
  // REFRESH (init khi F5 page - bypass interceptor)
  // -------------------------------------------------------
  refreshAuth: async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {
          method: 'POST',
          credentials: 'include',  //Require browser automatically attachs cookie into request
          headers: { 'Content-Type': 'application/json' }
        },

      );

      if (!response.ok) return null;

      const result = await response.json();
      setAccessToken(result.data.accessToken);
      return result;
    } catch {
      return null;
    }
  },


  // VERIFY EMAIL (Xác thực tài khoản)
  // -------------------------------------------------------
  verifyEmail: async (token) => {
    // Gửi phương thức POST kèm theo cái token lấy được từ thanh URL
    // Hãy chắc chắn Backend của bạn đang dùng đường dẫn '/auth/verify-email' nhé
    const { data } = await authClient.post('/auth/verify-email', { token });
    return data.data;
  },
};
