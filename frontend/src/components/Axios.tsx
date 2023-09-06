import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const token = localStorage.getItem('user_token');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Authorization': `${token}`
  },
});

export default axiosInstance;
