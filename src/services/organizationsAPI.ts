import { StorageKeys } from "../common/StorageKeys"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"

// Helper function để lấy token từ localStorage
const getAuthToken = () => {
  return localStorage.getItem(StorageKeys.AUTH_TOKEN) || ""
}

// Helper function để tạo headers với authorization
const getHeaders = () => {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Types và Interfaces
export interface Organization {
  id: string
  name: string
  type: string
  status: "active" | "pending" | "suspended"
  adminEmail?: string
  description?: string
  walletAddress?: string
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
  walletAddress?: string
  logo?: string
  website?: string
}

export interface UpdateOrganizationData {
  name?: string
  description?: string
  type?: string
  walletAddress?: string
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
      const response = await fetch(`${API_BASE_URL}/organizations`, {
        method: "GET",
        headers: getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Get organizations error:", error)
      throw error
    }
  },

  /**
   * Lấy organization theo ID
   * GET /organizations/{id}
   */
  async getById(id: string): Promise<OrganizationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${id}`, {
        method: "GET",
        headers: getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Get organization error:", error)
      throw error
    }
  },

  /**
   * Tạo organization mới
   * POST /organizations
   */
  async create(data: CreateOrganizationData): Promise<OrganizationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Create organization error:", error)
      throw error
    }
  },

  /**
   * Cập nhật organization
   * PATCH /organizations/{id}
   */
  async update(id: string, data: UpdateOrganizationData): Promise<OrganizationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Update organization error:", error)
      throw error
    }
  },

  /**
   * Kích hoạt organization
   * POST /organizations/{id}/activate
   */
  async activate(id: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${id}/activate`, {
        method: "POST",
        headers: getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Activate organization error:", error)
      throw error
    }
  },

  /**
   * Tạm ngưng organization
   * POST /organizations/{id}/suspend
   */
  async suspend(id: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${id}/suspend`, {
        method: "POST",
        headers: getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Suspend organization error:", error)
      throw error
    }
  },

  /**
   * Xóa organization (nếu API hỗ trợ)
   * DELETE /organizations/{id}
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Delete organization error:", error)
      throw error
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

      const response = await fetch(`${API_BASE_URL}/organizations/search?${params.toString()}`, {
        method: "GET",
        headers: getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Search organizations error:", error)
      throw error
    }
  },
}

// Export default
export default organizationsAPI
