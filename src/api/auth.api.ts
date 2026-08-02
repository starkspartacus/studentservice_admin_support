import { axiosInstance } from './axiosInstance';

export interface AdminLoginDto {
  email?: string;
  password?: string;
}

export const authApi = {
  /**
   * Admin Login endpoint
   */
  adminLogin: async (data: AdminLoginDto) => {
    const response = await axiosInstance.post('/auth/admin/login', data);
    return response.data;
  },

  /**
   * Get current authenticated user profile
   */
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  /**
   * Admin Logout
   */
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (e) {
      // Ignore logout errors
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
  },
};
