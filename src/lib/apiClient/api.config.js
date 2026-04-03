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
let isRefreshing = false;

// Use Queue to save all the stuck request because of expired access tokens
let requestQueue = [];




// -----------------------------------QUEUE FUNCTION--------------------------------------- //

// Function to handle all the queue after the refresh token process's result
const processQueue = (error, newToken = null) => {

  // For each waiting request
  requestQueue.forEach(({ resolve, reject }) => {

    // If refresh token failed -> reject all the requests
    if (error) reject(error);

    // If refresh token success -> applyy for all the requests
    else resolve(newToken);
  })

  // Delete queue after all
  requestQueue.length = 0;
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

// 2. Response interceptor - AUTO REFRESH + QUEUE
apiClient.interceptors.response.use(

  // When request success (2xx)
  (response) => response,

  // When request fail
  async (error) => {

    // Save originalRequest 
    const originalRequest = error.config;

    // If auth endpoints
    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token");
originalRequest.url?.includes("/auth/logout");

    // Handle when server return 401 + originalRequest is non _retry
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {

      // Mark this request is handling
      originalRequest._retry = true;

      // If on refresh token process, push request into queue
      if (isRefreshing) {

        // Create new promise, push into queue
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject });
        })

          // After had new token
          .then((newToken) => {
            accessToken = newToken;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Mark this is the first 401 request -> start refresh token
      isRefreshing = true;

      try {

        // Call BE to refresh token (BE read from cookie HTTP-only)
        const { data } = await authClient.post("/auth/refresh-token");
        const newToken = data.data.accessToken;

        // Update token in memory
        accessToken = newToken;

        // Solve all the requests in queue
        processQueue(null, newToken);

        // Fix the original request and send again
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {

        // If refresh token fail -> all the requests in queue will be rejected
        processQueue(refreshError, null);

        // Clear token
        accessToken = null;

        // Redirect to login
        window.location.href = "/login";

        return Promise.reject(refreshError);

      } finally {

        isRefreshing = false;

      }
    }

    // Another exception
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------------------- //


export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export default apiClient;