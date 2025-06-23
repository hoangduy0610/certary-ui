import MainApiRequest from "./MainApiRequest"

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  // walletAddress: string
}

export const authAPI = {
  async signin(data: LoginData) {
    try {
      const response = await MainApiRequest.post(`/auth/signin`, data)
      if (!response?.data?.token) {
        throw new Error("Login failed")
      }
      return response.data
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        `HTTP error! status: ${error.response?.status}`
      console.error("Signin error:", message)
      throw new Error(message)
    }
  },

  async register(data: RegisterData) {
    try {
      const response = await MainApiRequest.post(`/auth/register`, data)
      return response.data
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        `HTTP error! status: ${error.response?.status}`
      console.error("Register error:", message)
      throw new Error(message)
    }
  },

  async callback() {
    try {
      const response = await MainApiRequest.get(`/auth/callback`)
      return response.data
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        `HTTP error! status: ${error.response?.status}`
      console.error("Callback error:", message)
      throw new Error(message)
    }
  },

  async sendEmailReset(email: string) {
    try {
      const response = await MainApiRequest.post(`/auth/forgot-password`, { email })
      return response.data
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        `HTTP error! status: ${error.response?.status}`
      console.error("Send reset email error:", message)
      throw new Error(message)
    }
  },
  async verifyResetToken(token: string) {
    try {
      const response = await MainApiRequest.post(`/auth/verify-reset-token`, {
        token,
      })
      return response.data
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        `HTTP error! status: ${error.response?.status}`
      console.error("Verify reset token error:", message)
      throw new Error(message)
    }
  },
  async resetPassword(token: string, newPassword: string) {
    try {
      const response = await MainApiRequest.post(`/auth/reset-password`, {
        token,
        password: newPassword,
      })
      return response.data
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        `HTTP error! status: ${error.response?.status}`
      console.error("Reset password error:", message)
      throw new Error(message)
    }
  },
}
