import { axiosInstance } from './axiosInstance';

export const verificationApi = {
  /**
   * Get list of pending student profiles requiring admin approval
   */
  getPendingStudentProfiles: async (page = 1, limit = 20) => {
    const response = await axiosInstance.get('/verification/students/pending', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Approve a student's profile & unlock dashboard access
   */
  approveStudentProfile: async (studentUserId: string) => {
    const response = await axiosInstance.patch(`/verification/student/${studentUserId}/approve`);
    return response.data;
  },

  /**
   * Reject a student's profile with a specific reason
   */
  rejectStudentProfile: async (studentUserId: string, reason: string) => {
    const response = await axiosInstance.patch(`/verification/student/${studentUserId}/reject`, { reason });
    return response.data;
  },

  /**
   * Get pending verification documents
   */
  getPendingDocuments: async (page = 1, limit = 20) => {
    const response = await axiosInstance.get('/verification/documents/pending', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Review an individual verification document (APPROVED or REJECTED)
   */
  reviewDocument: async (verificationId: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) => {
    const response = await axiosInstance.patch(`/verification/documents/${verificationId}/review`, {
      status,
      rejectionReason,
    });
    return response.data;
  },

  /**
   * Get list of pending company profiles requiring admin approval
   */
  getPendingCompanyProfiles: async (page = 1, limit = 20) => {
    const response = await axiosInstance.get('/verification/companies/pending', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Approve a company's profile & grant Partner Certificate Badge 🛡️
   */
  approveCompanyProfile: async (companyUserId: string) => {
    const response = await axiosInstance.patch(`/verification/company/${companyUserId}/approve`);
    return response.data;
  },

  /**
   * Reject a company's profile with a specific reason
   */
  rejectCompanyProfile: async (companyUserId: string, reason: string) => {
    const response = await axiosInstance.patch(`/verification/company/${companyUserId}/reject`, { reason });
    return response.data;
  },
};
