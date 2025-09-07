// frontend/src/utils/api.js
import { useAuth } from '@clerk/clerk-react';

export const useApi = () => {
  const { getToken } = useAuth();

  const fetchWithAuth = async (url, options = {}) => {
    const token = await getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return { fetchWithAuth };
};