// src/api/CertificateApis.ts
import MainApiRequest from "./MainApiRequest"

export interface Certificate {
    id: number
    title: string
    description?: string
    recipientEmail: string
    additionalData?: Record<string, any>
    status: 'draft' | 'waiting_for_id' | 'issued' | 'claimed' | 'revoked'
    createdAt: Date
    updatedAt: Date
}

export interface CreateCertificateDto {
    title: string
    description?: string
    recipientEmail: string
    additionalData?: Record<string, any>
    status?: Certificate['status']
}

export interface UpdateCertificateDto extends CreateCertificateDto { }

export const CertificateAPI = {
    async create(payload: CreateCertificateDto): Promise<Certificate> {
        try {
            const response = await MainApiRequest.post(`/certificates`, payload)
            return response.data
        } catch (error: any) {
            console.error("Create certificate error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async getAll(): Promise<Certificate[]> {
        try {
            const response = await MainApiRequest.get(`/certificates`)
            return response.data
        } catch (error: any) {
            console.error("Get all certificates error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async getById(id: number): Promise<Certificate> {
        try {
            const response = await MainApiRequest.get(`/certificates/${id}`)
            return response.data
        } catch (error: any) {
            console.error("Get certificate by ID error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async update(id: number, payload: UpdateCertificateDto): Promise<Certificate> {
        try {
            const response = await MainApiRequest.patch(`/certificates/${id}`, payload)
            return response.data
        } catch (error: any) {
            console.error("Update certificate error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async importCsv(file: File): Promise<any> {
        try {
            const formData = new FormData()
            formData.append("file", file)
            const response = await MainApiRequest.post(`/certificates/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.data
        } catch (error: any) {
            console.error("Import CSV error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async revoke(id: number): Promise<any> {
        try {
            const response = await MainApiRequest.post(`/certificates/${id}/revoke`)
            return response.data
        } catch (error: any) {
            console.error("Revoke certificate error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async verify(certificateId: string): Promise<Certificate> {
        try {
            const response = await MainApiRequest.get(`/certificates/verify/${certificateId}`)
            return response.data
        } catch (error: any) {
            console.error("Verify certificate error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async claim(): Promise<any> {
        try {
            const response = await MainApiRequest.post(`/certificates/claim`)
            return response.data
        } catch (error: any) {
            console.error("Claim certificate error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    }
}
