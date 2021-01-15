import axios from 'axios';

import { API_URL } from '../config';

const headers =
  process.env.NODE_ENV === 'development' ? { uid: 'mluukkai' } : undefined;

const apiClient = axios.create({
  baseURL: API_URL,
  headers,
});

export default apiClient;
