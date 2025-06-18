import MainApiRequest from "./MainApiRequest"

// Types và Interfaces
export interface Organization {
  id: string
  name: string
  type: string
  status: "active" | "pending" | "suspended"
  adminEmail?: string
  description?: string
  // walletAddress?: string
  logo?: string
  website?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateOrganizationData {
  name: string
  adminEmail: string
  adminPassword: string
  description?: string
  type: string
  // walletAddress?: string
  logo?: string
  website?: string
}

export interface UpdateOrganizationData {
  name?: string
  description?: string
  type?: string
  // walletAddress?: string
  logo?: string
  website?: string
}

export interface OrganizationsResponse {
  data: Organization[]
  total: number
  page: number
  limit: number
}

export interface OrganizationResponse {
  data: Organization
  message?: string
}

// Organizations API Service
export const organizationsAPI = {
  /**
   * Lấy tất cả organizations
   * GET /organizations
   */
  async getAll(): Promise<Organization[]> {
    try {
      const response = await MainApiRequest.get(`/organizations`)
      return response.data
    } catch (error: any) {
      console.error("Get organizations error:", error)
      throw new Error(error.response?.data?.message || error.message)
    }
  },

  /**
   * Lấy organization theo ID
   * GET /organizations/{id}
   */
  async getById(id: string): Promise<OrganizationResponse> {
    try {
      const response = await MainApiRequest.get(`/organizations/${id}`)
      return response.data
    } catch (error: any) {
      console.error("Get organization error:", error)
      throw new Error(error.response?.data?.message || error.message)
    }
  },

  /**
   * Tạo organization mới
   * POST /organizations
   */
  async create(data: CreateOrganizationData): Promise<OrganizationResponse> {
    try {
      const response = await MainApiRequest.post(`/organizations`, data)
      return response.data
    } catch (error: any) {
      console.error("Create organization error:", error)
      throw new Error(error.response?.data?.message || error.message)
    }
  },

  /**
   * Cập nhật organization
   * PATCH /organizations/{id}
   */
  async update(id: string, data: UpdateOrganizationData): Promise<OrganizationResponse> {
    try {
      const response = await MainApiRequest.patch(`/organizations/${id}`, data)
      return response.data
    } catch (error: any) {
      console.error("Update organization error:", error)
      throw new Error(error.response?.data?.message || error.message)
    }
  },

  /**
   * Kích hoạt organization
   * POST /organizations/{id}/activate
   */
  async activate(id: string): Promise<{ message: string }> {
    try {
      const response = await MainApiRequest.post(`/organizations/${id}/activate`)
      return response.data
    } catch (error: any) {
      console.error("Activate organization error:", error)
      throw new Error(error.response?.data?.message || error.message)
    }
  },

  /**
   * Tạm ngưng organization
   * POST /organizations/{id}/suspend
   */
  async suspend(id: string): Promise<{ message: string }> {
    try {
      const response = await MainApiRequest.post(`/organizations/${id}/suspend`)
      return response.data
    } catch (error: any) {
      console.error("Suspend organization error:", error)
      throw new Error(error.response?.data?.message || error.message)
    }
  },

  /**
   * Xóa organization (nếu API hỗ trợ)
   * DELETE /organizations/{id}
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      const response = await MainApiRequest.delete(`/organizations/${id}`)
      return response.data
    } catch (error: any) {
      console.error("Delete organization error:", error)
      throw new Error(error.response?.data?.message || error.message)
    }
  },

  /**
   * Bulk activate organizations
   */
  async bulkActivate(ids: string[]): Promise<{ message: string; success: number; failed: number }> {
    try {
      const results = await Promise.allSettled(ids.map((id) => this.activate(id)))
      const success = results.filter((result) => result.status === "fulfilled").length
      const failed = results.filter((result) => result.status === "rejected").length

      return {
        message: `Activated ${success} organizations, ${failed} failed`,
        success,
        failed,
      }
    } catch (error) {
      console.error("Bulk activate error:", error)
      throw error
    }
  },

  /**
   * Bulk suspend organizations
   */
  async bulkSuspend(ids: string[]): Promise<{ message: string; success: number; failed: number }> {
    try {
      const results = await Promise.allSettled(ids.map((id) => this.suspend(id)))
      const success = results.filter((result) => result.status === "fulfilled").length
      const failed = results.filter((result) => result.status === "rejected").length

      return {
        message: `Suspended ${success} organizations, ${failed} failed`,
        success,
        failed,
      }
    } catch (error) {
      console.error("Bulk suspend error:", error)
      throw error
    }
  },

  /**
   * Search organizations
   */
  async search(query: string, filters?: { type?: string; status?: string }): Promise<OrganizationsResponse> {
    try {
      const params = new URLSearchParams()
      if (query) params.append("q", query)
      if (filters?.type) params.append("type", filters.type)
      if (filters?.status) params.append("status", filters.status)

      const response = await MainApiRequest.get(`/organizations/search?${params.toString()}`)
      return response.data
    } catch (error: any) {
      console.error("Search organizations error:", error)
      throw new Error(error.response?.data?.message || error.message)
    }
  },
}

// Export default
export default organizationsAPI
