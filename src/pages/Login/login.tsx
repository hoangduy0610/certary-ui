"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import "./login.scss"
import { authAPI } from "../../services/authAPI"
import { StorageKeys } from "../../common/StorageKeys"

interface LoginFormData {
  email: string
  password: string
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await authAPI.signin(formData)
      localStorage.setItem(StorageKeys.AUTH_TOKEN, response.token || "")
      localStorage.setItem(StorageKeys.USER_INFO, JSON.stringify(response.info || {}))
      console.log("Đăng nhập thành công:", response)
      // Chuyển hướng về trang chủ
      navigate("/")
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h1>Đăng nhập</h1>
            <p>Chào mừng bạn quay trở lại</p>
          </div>

          {error && <div className="error-message">{error}</div>}

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

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Ghi nhớ đăng nhập
            </label>
            <a href="#forgot" className="forgot-link">
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="form-footer">
            <p>
              Chưa có tài khoản?{" "}
              <a href="/register" className="register-link">
                Đăng ký ngay
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
