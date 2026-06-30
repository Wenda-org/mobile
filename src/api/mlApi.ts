import axios from 'axios';

export const ML_API_URL = 'https://backend-ml-c75p.onrender.com/api/ml';

const mlApi = axios.create({
  baseURL: ML_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default mlApi;
