import MainApiRequest from './MainApiRequest';

const API_BASE = '/certificate-types';

export interface CertificateType {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  name: string;
  description: string;
  layoutJson: any;
  organizationId: number;
}

export interface CreateCertificateTypeDto {
  id?: number;
  name: string;
  description: string;
  layoutJson?: any;
}

export const CertificateTypeAPI = {
  getAll: async (): Promise<CertificateType[]> => {
    const res = await MainApiRequest.get(API_BASE);
    return res.data;
  },

  getById: async (id: number): Promise<CertificateType> => {
    const res = await MainApiRequest.get(`${API_BASE}/${id}`);
    return res.data;
  },

  create: async (data: CreateCertificateTypeDto): Promise<CertificateType> => {
    const res = await MainApiRequest.post(API_BASE, data);
    return res.data;
  },

  update: async (id: number, data: Partial<CreateCertificateTypeDto>): Promise<CertificateType> => {
    const res = await MainApiRequest.patch(`${API_BASE}/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await MainApiRequest.delete(`${API_BASE}/${id}`);
  },
};
