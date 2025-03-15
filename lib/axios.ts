import axios from "axios";

function setHeaderRequest() {
  const authorization = localStorage.getItem("authorization");
  const refreshToken = localStorage.getItem("refreshToken");

  const headers = new axios.AxiosHeaders();
  headers.set("authorization", authorization ? authorization : "");
  headers.set("refreshToken", refreshToken ? refreshToken : "");
  headers.set("Content-Type", "application/json");
  return headers;
}

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

const authenticatedRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
  timeout: 60000,
});

authenticatedRequest.interceptors.request.use(
  (config) => {
    config.headers = setHeaderRequest();
    return config;
  },
  (error) => Promise.reject(error)
);

authenticatedRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const currentRequest = error.config;

    // If refresh token is invalid, log out user
    if (
      error.response?.status === 401 &&
      error.response?.data?.msg === "Invalid refresh token"
    ) {
      localStorage.removeItem("authorization");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login"; // Redirect to login page
      return Promise.reject(error);
    }

    // If access token is invalid, try refreshing it
    if (
      error.response?.status === 401 &&
      error.response?.data?.msg === "Invalid access token" &&
      !currentRequest._retry
    ) {
      currentRequest._retry = true;

      try {
        const refreshResponse = await request.get("api/authentication/refresh-access-token");
        const newAccessToken = refreshResponse.data.accessToken;

        // Save new token and retry original request
        localStorage.setItem("authorization", `Bearer ${newAccessToken}`);
        currentRequest.headers["authorization"] = `Bearer ${newAccessToken}`;

        return authenticatedRequest(currentRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { request, authenticatedRequest };
