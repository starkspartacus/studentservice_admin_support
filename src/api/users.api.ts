import { axiosInstance } from './axiosInstance';

export const usersApi = {
  /**
   * Get paginated list of users (Students, Companies, Admins)
   */
  getUsers: async (params?: { role?: string; status?: string; search?: string; page?: number; limit?: number }) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  },

  /**
   * Get single user profile by ID
   */
  getUserById: async (userId: string) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Admin update account status (APPROVED, REJECTED, PENDING, SUSPENDED)
   */
  updateUserStatus: async (userId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING' | 'SUSPENDED') => {
    const response = await axiosInstance.patch(`/users/${userId}/status`, { status });
    return response.data;
  },
};
