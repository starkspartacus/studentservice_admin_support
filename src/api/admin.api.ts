import { axiosInstance } from './axiosInstance';

export const adminApi = {
  /**
   * Get main admin dashboard summary metrics
   */
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
  },

  /**
   * Get financial metrics (total revenue, commissions, pending withdrawals)
   */
  getFinancialStats: async () => {
    const response = await axiosInstance.get('/admin/financial-stats');
    return response.data;
  },

  /**
   * Get pending withdrawals for student payouts
   */
  getPendingWithdrawals: async () => {
    const response = await axiosInstance.get('/admin/pending-withdrawals');
    return response.data;
  },

  /**
   * Get cash regularizations
   */
  getCashRegularizations: async () => {
    const response = await axiosInstance.get('/admin/cash-regularizations');
    return response.data;
  },
};
