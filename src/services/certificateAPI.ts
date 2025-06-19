// src/api/CertificateApis.ts
import MainApiRequest from "./MainApiRequest"
import { CertificateType } from "./certificateTypeAPI"
import { Organization } from "./organizationsAPI"
import { User } from "./userAPI"

export enum EnumCertificateStatus {
    DRAFT = 'draft',
    REJECTED = 'rejected',
    ISSUED = 'issued',
    CLAIMED = 'claimed',
    REVOKED = 'revoked',
    EXPIRED = 'expired',
}

export interface Certificate {
    id: number
    title: string
    description?: string
    recipientEmail: string
    status: EnumCertificateStatus;
    createdAt: Date
    updatedAt: Date
    issuer?: Organization
    owner?: User
    certificateId?: string
    tokenId?: string
    expiredAt?: Date
    remark?: string
    certificateTypeId: number
    certificateType: CertificateType
    isClaimable?: boolean
    revoked?: boolean
}

export interface CreateCertificateDto {
    title: string
    description?: string
    recipientEmail: string
    expiredAt?: Date
    certificateTypeId: number
}

export interface UpdateCertificateDto extends Partial<CreateCertificateDto> { }

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

    async verify(certificateId: string): Promise<{ valid: boolean, nftVerified: boolean, certificate: Certificate }> {
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
    },

    async approve(id: number): Promise<Certificate> {
        try {
            const response = await MainApiRequest.post(`/certificates/${id}/approve`)
            return response.data
        } catch (error: any) {
            console.error("Approve certificate error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async reject(id: number, reason: string): Promise<Certificate> {
        try {
            const response = await MainApiRequest.post(`/certificates/${id}/reject`, {
                reason
            })
            return response.data
        } catch (error: any) {
            console.error("Reject certificate error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async download(id: number): Promise<Blob> {
        try {
            const response = await MainApiRequest.get(`/certificates/png/${id}`, {
                responseType: 'blob'
            })
            return response.data
        } catch (error: any) {
            console.error("Download certificate error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    }
}
