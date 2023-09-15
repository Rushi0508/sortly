import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://sortly-backend.vercel.app',
  // headers: {
  //   'Authorization': `${token}`
  // },
});
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from where you stored it (e.g., localStorage)
    const token = localStorage.getItem('user_token'); // Replace with your actual token storage method
    if (token) {
      // Add the token to the Authorization header
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
