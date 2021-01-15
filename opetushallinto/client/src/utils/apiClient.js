import axios from 'axios';

import { API_URL, IS_DEVELOPMENT } from '../config';

const headers = IS_DEVELOPMENT ? { uid: 'mluukkai' } : undefined;

const apiClient = axios.create({
  baseURL: API_URL,
  headers,
});

export default apiClient;
