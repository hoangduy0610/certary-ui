import axios from 'axios';

const API_BASE = '/api/certificate-types'; // hoặc đường dẫn thật nếu bạn đã có

export interface CertificateType {
  id: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificateTypeDto {
  name: string;
  code: string;
  description?: string;
  active: boolean;
}

export const CertificateTypeAPI = {
  getAll: async (): Promise<CertificateType[]> => {
    const res = await axios.get(API_BASE);
    return res.data;
  },

  getById: async (id: string): Promise<CertificateType> => {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data;
  },

  create: async (data: CreateCertificateTypeDto): Promise<CertificateType> => {
    const res = await axios.post(API_BASE, data);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateCertificateTypeDto>): Promise<CertificateType> => {
    const res = await axios.put(`${API_BASE}/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/${id}`);
  },
};
