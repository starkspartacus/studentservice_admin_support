import { axiosInstance } from './axiosInstance';

export const jobsApi = {
  /**
   * Get list of jobs posted by recruiters
   */
  getJobs: async (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const response = await axiosInstance.get('/jobs', { params });
    return response.data;
  },

  /**
   * Get single job offer details by ID
   */
  getJobById: async (jobId: string) => {
    const response = await axiosInstance.get(`/jobs/${jobId}`);
    return response.data;
  },

  /**
   * Update job status (Moderate / Suspend / Reactivate)
   */
  updateJobStatus: async (jobId: string, status: string) => {
    const response = await axiosInstance.patch(`/jobs/${jobId}/status`, { status });
    return response.data;
  },
};
