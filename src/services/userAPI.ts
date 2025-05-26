// src/api/UserApis.ts
import MainApiRequest from "./MainApiRequest"

export interface User {
    id: number
    email: string
    firstName?: string
    lastName?: string
    walletAddress?: string
    role: 'admin' | 'org_manager' | 'org_staff' | 'user'
}

export interface UpdateUserDto {
    email: string
    firstName?: string
    lastName?: string
    // walletAddress?: string
    role: User['role']
}

export interface UpdateWalletDto {
    walletAddress: string
}

export interface AddToOrganizationDto {
    organizationId: number
    role: 'org_manager' | 'org_staff'
}

export const UserAPI = {
    async getAll(): Promise<User[]> {
        try {
            const response = await MainApiRequest.get(`/user`)
            return response.data
        } catch (error: any) {
            console.error("Get users error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async getProfile(): Promise<User> {
        try {
            const response = await MainApiRequest.get(`/user/profile`)
            return response.data
        } catch (error: any) {
            console.error("Get profile error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async updateProfile(payload: UpdateUserDto): Promise<User> {
        try {
            const response = await MainApiRequest.patch(`/user/profile`, payload)
            return response.data
        } catch (error: any) {
            console.error("Update profile error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async update(id: number, payload: UpdateUserDto): Promise<User> {
        try {
            const response = await MainApiRequest.patch(`/user/profile/${id}`, payload)
            return response.data
        } catch (error: any) {
            console.error("Update profile error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async getById(id: number): Promise<User> {
        try {
            const response = await MainApiRequest.get(`/user/${id}`)
            return response.data
        } catch (error: any) {
            console.error("Get user by ID error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async updateWallet(payload: UpdateWalletDto): Promise<User> {
        try {
            const response = await MainApiRequest.patch(`/user/wallet`, payload)
            return response.data
        } catch (error: any) {
            console.error("Update wallet error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async addToOrganization(id: number, payload: AddToOrganizationDto): Promise<any> {
        try {
            const response = await MainApiRequest.post(`/user/${id}/add-to-organization`, payload)
            return response.data
        } catch (error: any) {
            console.error("Add to organization error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },

    async removeFromOrganization(id: number): Promise<any> {
        try {
            const response = await MainApiRequest.post(`/user/${id}/remove-from-organization`)
            return response.data
        } catch (error: any) {
            console.error("Remove from organization error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    }
}
