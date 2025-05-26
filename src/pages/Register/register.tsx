import type React from "react"
import { useState } from "react"

import "./register.scss"
import { authAPI } from "../../services/authAPI"

interface RegisterFormData {
  email: string
  password: string
  firstName: string
  lastName: string
  walletAddress: string
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    walletAddress: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
    setSuccessMessage("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      const response = await authAPI.register(formData)
      console.log("Đăng ký thành công:", response)

      setSuccessMessage("Đăng ký thành công!")
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        walletAddress: "",
      })
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h1>Đăng ký</h1>
            <p>Tạo tài khoản mới để bắt đầu</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Họ</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Tên</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="walletAddress">Địa chỉ ví</label>
            <input
              type="text"
              id="walletAddress"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              placeholder="0x1234..."
              required
            />
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" required />
              <span className="checkmark"></span>
              Tôi đồng ý với{" "}
              <a href="#terms" className="terms-link">
                Điều khoản sử dụng
              </a>
            </label>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <div className="form-footer">
            <p>
              Đã có tài khoản?{" "}
              <a href="/login" className="login-link">
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm
