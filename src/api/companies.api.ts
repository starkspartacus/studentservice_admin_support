import { axiosInstance } from './axiosInstance';

export const companiesApi = {
  /**
   * Get list of company recruiters
   */
  getCompanies: async (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const response = await axiosInstance.get('/companies', { params });
    return response.data;
  },

  /**
   * Get single company details by ID
   */
  getCompanyById: async (companyId: string) => {
    const response = await axiosInstance.get(`/companies/${companyId}`);
    return response.data;
  },
};
