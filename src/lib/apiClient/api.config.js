// services/api.config.js
import axios from 'axios';


// -----------------------------------EXPORT APICLIENT FOR ALL REQUEST EXCEPT LOGIN & REGISTER & REFRESH TOKEN & LOGOUT--------------------------------------- //

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// ---------------------------------------------------------------------------------------------------------------------------------- //



// -----------------------------------EXPORT AUTHCLIENT FOR JUST LOGIN & REGISTER & REFRESH TOKEN & LOGOUT--------------------------------------- //

export const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// ---------------------------------------------------------------------------------------------------------------------------------------------- //



// Memory storage (to save access token)
let accessToken = null;


// -----------------------------------REFRESH TOKEN ONCE--------------------------------------- //

let refreshPromise = null;

export const refreshTokenOnce = async () => {

  // Đang có refresh chạy → trả về cùng Promise, không tạo thêm
  if (refreshPromise) return refreshPromise;

  refreshPromise = authClient.post('/auth/refresh-token')
    .then(({ data }) => {
      const newToken = data.data.accessToken;
      accessToken = newToken;                 // cập nhật memory
      return data;                            // trả về để initAuth() dùng
    })
    .finally(() => {
      refreshPromise = null;                   // reset lock dù thành công hay thất bại
    })

  return refreshPromise;
}

// ---------------------------------------------------------------------------------------- //








// -----------------------------------REQUEST INTERCEPTOR--------------------------------------- //

// 1. Request interceptor: Add token into token before send to BE
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------------------- //




// -----------------------------------RESPONSE INTERCEPTOR--------------------------------------- //
const PUBLIC_PATHS = ['/', '/jobs', '/companies', '/login', '/register'];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh-token') ||
      originalRequest.url?.includes('/auth/logout');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        await refreshTokenOnce();

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        accessToken = null;

        if (typeof window !== 'undefined') {
          const isPublicPage = PUBLIC_PATHS.some(
            (path) =>
              window.location.pathname === path ||
              window.location.pathname.startsWith(path + '/')
          );

          if (!isPublicPage) window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


// ---------------------------------------------------------------------------------------- //


export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export default apiClient;